#!/usr/bin/env node
// Moves the Jira tickets a pull request title cites, forward only.
//
//   PR_TITLE='fix: thing (WH-1234)' node jira-sync.mjs WH='In Gateway,In Review'
//
// Each argument is PROJECT='Status[,Fallback status]'. Set DRY_RUN=1 to report without writing.

const CLOUD_ID = '0b7ca77e-5961-4878-bb06-ce25499c17ac'
const API = `https://api.atlassian.com/ex/jira/${CLOUD_ID}/rest/api/3`
const TOKEN_URL = 'https://auth.atlassian.com/oauth/token'

// A ticket only ever moves to a later stage, so a reopened or follow-up pull request
// cannot drag one back out of review or QA.
const STAGES = [
  [
    'to do',
    'backlog',
    'triage',
    'to investigate',
    'investigating',
    'bug identified',
    'blocked',
    'queued',
    'pending reproduction',
    'suspected dup'
  ],
  ['in progress'],
  ['in gateway', 'in review'],
  ['in qa']
]

const PARKED = new Set([
  'fixed',
  'done',
  'rejected',
  'duplicate',
  'on hold',
  'pending cs',
  'in cs',
  'pending rca',
  'pending automation'
])

const warn = (message) => console.log(`::warning::${message}`)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const sameStatus = (a, b) => a.toLowerCase() === b.toLowerCase()

function stageOf(status) {
  const name = status.toLowerCase()
  if (PARKED.has(name)) {
    return Infinity
  }
  const stage = STAGES.findIndex((statuses) => statuses.includes(name))
  return stage === -1 ? undefined : stage
}

function parseRules(args) {
  const rules = new Map()
  for (const arg of args) {
    const [project, statuses] = arg.split('=')
    const targets = (statuses ?? '')
      .split(',')
      .map((status) => status.trim())
      .filter(Boolean)
    if (!project || targets.length === 0 || stageOf(targets[0]) === undefined) {
      throw new Error(`bad rule "${arg}", expected PROJECT='Status[,Status]'`)
    }
    rules.set(project.toUpperCase(), targets)
  }
  return rules
}

// `ref-WH-1234` mentions a ticket without claiming to fix it, and WH-0000 marks a change
// with no ticket.
function citedKeys(title, projects) {
  const pattern = new RegExp(`(ref-)?\\b(${projects.join('|')})-(\\d+)\\b`, 'gi')
  const keys = new Set()
  for (const [, ref, project, number] of title.matchAll(pattern)) {
    if (!ref && Number(number) !== 0) {
      keys.add(`${project.toUpperCase()}-${number}`)
    }
  }
  return [...keys]
}

async function authenticate(clientId, clientSecret) {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    })
  })
  const token = response.ok ? (await response.json()).access_token : undefined
  if (!token) {
    throw new Error(`the Jira token endpoint returned ${response.status}`)
  }
  return token
}

function jiraClient(token) {
  const call = async (method, path, body) => {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(body && { 'Content-Type': 'application/json' })
      },
      body: body && JSON.stringify(body)
    })
    if (!response.ok) {
      throw Object.assign(new Error(`${method} ${path} returned ${response.status}`), {
        status: response.status
      })
    }
    return response.status === 204 ? undefined : response.json()
  }

  const get = async (path) => {
    for (let attempt = 1; ; attempt++) {
      try {
        return await call('GET', path)
      } catch (error) {
        const transient = error.status === undefined || error.status === 429 || error.status >= 500
        if (!transient || attempt === 3) {
          throw error
        }
        await sleep(500 * 2 ** attempt)
      }
    }
  }

  return {
    status: async (key) => (await get(`/issue/${key}?fields=status`)).fields.status.name,
    transitions: async (key) => (await get(`/issue/${key}/transitions`)).transitions,
    // Not retried: a write that failed halfway may still have moved the ticket.
    transition: (key, id) => call('POST', `/issue/${key}/transitions`, { transition: { id } })
  }
}

function pickTransition(transitions, targets) {
  for (const target of targets) {
    const matches = transitions.filter((transition) => sameStatus(transition.to.name, target))
    if (matches.length > 0) {
      return matches.find((transition) => !transition.hasScreen) ?? matches[0]
    }
  }
  return undefined
}

async function moveOne(jira, key, targets, dryRun) {
  let status
  try {
    status = await jira.status(key)
  } catch (error) {
    warn(
      error.status === 404
        ? `${key}: no such ticket in Jira.`
        : `${key}: could not read it: ${error.message}.`
    )
    return
  }

  const stage = stageOf(status)
  if (stage === undefined) {
    warn(`${key} is in "${status}", which jira-sync does not classify, so it was left alone.`)
    return
  }
  if (stage >= stageOf(targets[0])) {
    console.log(`${key}: left in "${status}"`)
    return
  }

  let move
  try {
    move = pickTransition(await jira.transitions(key), targets)
  } catch (error) {
    warn(`${key}: could not list its transitions: ${error.message}.`)
    return
  }
  if (!move) {
    warn(
      `${key}: its workflow offers no route from "${status}" to ${targets.join(' or ')}, so it was left alone.`
    )
    return
  }
  if (dryRun) {
    console.log(`${key}: would move "${status}" -> "${move.to.name}"`)
    return
  }

  try {
    await jira.transition(key, move.id)
  } catch (error) {
    const now = await jira.status(key).catch(() => undefined)
    if (!now || !targets.some((target) => sameStatus(target, now))) {
      warn(`${key}: could not move it out of "${status}": ${error.message}.`)
      return
    }
  }
  console.log(`${key}: "${status}" -> "${move.to.name}"`)
}

async function main() {
  const rules = parseRules(process.argv.slice(2))
  const keys = citedKeys(process.env.PR_TITLE ?? '', [...rules.keys()])
  if (keys.length === 0) {
    console.log('The pull request title cites no ticket to move.')
    return
  }

  const { JIRA_CLIENT_ID, JIRA_CLIENT_SECRET, DRY_RUN } = process.env
  if (!JIRA_CLIENT_ID || !JIRA_CLIENT_SECRET) {
    console.log(`::notice::No Jira credential is configured, so ${keys.join(', ')} was not moved.`)
    return
  }

  const jira = jiraClient(await authenticate(JIRA_CLIENT_ID, JIRA_CLIENT_SECRET))
  for (const key of keys) {
    await moveOne(jira, key, rules.get(key.split('-')[0]), Boolean(DRY_RUN))
  }
}

// Moving a ticket is a side effect, never a verdict: a failure here must not fail the pull request.
main().catch((error) => warn(`jira-sync: ${error.message}`))

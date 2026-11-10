// Helpers for update-consumers.yml, loaded via actions/github-script:
//   const { planAutoPrs } = require('./.github/scripts/consumer-prs.cjs')
//
// After a release, consumer repos that already have an open PR for one of the
// release tickets get that PR bumped (update-pr job). A repo with no such PR but
// with its own ticket in the release (WH → gohome, WEKAPP → wekapp) gets a PR
// that only bumps @weka/weka-ui-components (create-pr job), with review requested
// from the authors of the released weka-ui-components PRs.
//
// Each repo has at most one such PR, on AUTO_BRANCH: while it is open, every
// later release retargets it instead of opening another one that would conflict.

const UIC_OWNER = 'weka'
const UIC_REPO = 'weka-ui-components'
const UIC_PACKAGE = '@weka/weka-ui-components'

/** Branch of the auto-opened bump PR in every consumer repo. pr-preview-consumers.yml skips it. */
const AUTO_BRANCH = 'auto/weka-ui-components'

function isBot(user) {
  return !user || user.type === 'Bot' || user.login.endsWith('[bot]')
}

function splitList(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toTag(version) {
  return version.startsWith('v') ? version : `v${version}`
}

/** Tickets in `texts` that belong to this consumer, per its `ticket_pattern`. */
function pickTickets(texts, meta) {
  if (!meta.ticket_pattern) return []
  const pattern = new RegExp(`\\b(?:${meta.ticket_pattern})\\b`, 'gi')
  return [...new Set(texts.flatMap((t) => t.toUpperCase().match(pattern) || []))]
}

function buildTitle({ prefix, version, tickets }) {
  return `${prefix} update weka-ui-components to ${toTag(version).slice(1)} (${tickets.join(', ')})`
}

// Logins are written as code, not @mentions: authors already get a review request,
// and bots must not be pinged.
function buildBody({ version, paths, uicPrs }) {
  const tag = toTag(version)
  const releaseUrl = `https://github.com/${UIC_OWNER}/${UIC_REPO}/releases/tag/${tag}`
  const lines = [
    `Bumps \`${UIC_PACKAGE}\` to [${tag}](${releaseUrl}) in ${paths.map((p) => `\`${p}\``).join(', ')}.`,
    '',
    'Opened automatically after a weka-ui-components release because no open PR here referenced it. ' +
      'While this PR stays open, later releases retarget it instead of opening new ones.'
  ]
  if (uicPrs.length > 0) {
    lines.push('', `### Changes in ${tag}`, '')
    for (const pr of uicPrs) {
      lines.push(`- **${pr.title}** — ${UIC_OWNER}/${UIC_REPO}#${pr.number} by \`${pr.author}\``)
    }
  }
  return lines.join('\n')
}

async function loadUicPrs({ github, core, prNumbers }) {
  const uicPrs = []
  for (const number of splitList(prNumbers)) {
    try {
      const { data } = await github.rest.pulls.get({
        owner: UIC_OWNER,
        repo: UIC_REPO,
        pull_number: Number(number)
      })
      uicPrs.push({
        number: data.number,
        title: data.title,
        author: data.user.login,
        bot: isBot(data.user)
      })
    } catch (err) {
      core.warning(`Could not load ${UIC_REPO}#${number}: ${err.message}`)
    }
  }
  return uicPrs
}

async function listOpenPrsForBranch({ github, repo, branch }) {
  const [owner, name] = repo.split('/')
  const { data } = await github.rest.pulls.list({
    owner,
    repo: name,
    head: `${owner}:${branch}`,
    state: 'open'
  })
  return data
}

/**
 * Returns one entry per consumer repo whose auto PR the create-pr job opens or retargets.
 * `updates` are the open PRs matching the release tickets (without the auto PR) that update-pr
 * bumps. One covers the repo only if it targets the repo's base branch and carries one of the
 * repo's own release tickets, so neither a backport PR nor a PR that mentions only the other
 * project's ticket stops the auto PR.
 */
async function planAutoPrs({
  github,
  core,
  version,
  tickets,
  prNumbers,
  repoMeta,
  repoPaths,
  updates
}) {
  if (toTag(version).includes('-')) {
    core.info(`${version} is a prerelease — not opening consumer PRs`)
    return []
  }

  const releaseTickets = splitList(tickets)
  const planned = []
  for (const [repo, meta] of Object.entries(repoMeta)) {
    const [owner, name] = repo.split('/')
    const base =
      meta.base || (await github.rest.repos.get({ owner, repo: name })).data.default_branch
    const [autoPr] = await listOpenPrsForBranch({ github, repo, branch: AUTO_BRANCH })
    const repoTickets = pickTickets(releaseTickets, meta)

    if (!autoPr) {
      if (repoTickets.length === 0) {
        core.info(`${repo}: no release ticket matches ${meta.ticket_pattern} — skipping`)
        continue
      }
      const covering = updates.find(
        (pr) =>
          pr.repo === repo &&
          pr.base === base &&
          (pr.tickets || [pr.ticket]).some((t) => repoTickets.includes(t.toUpperCase()))
      )
      if (covering) {
        core.info(`${repo}: #${covering.number} matches the release tickets — it is bumped instead`)
        continue
      }
    }

    // An open auto PR keeps its earlier tickets so its title stays valid for every release it spans.
    const titleTickets = pickTickets([autoPr?.title || '', ...repoTickets], meta)
    if (titleTickets.length === 0) {
      core.warning(
        `${repo}: auto PR #${autoPr.number} has no ${meta.ticket_pattern} ticket — skipping`
      )
      continue
    }
    planned.push({ repo, meta, base, titleTickets })
    const action = autoPr ? `retargeting auto PR #${autoPr.number}` : 'opening an auto PR'
    core.info(`${repo}: ${action} on ${base}`)
  }

  if (planned.length === 0) return []

  const uicPrs = await loadUicPrs({ github, core, prNumbers })
  const reviewers = [...new Set(uicPrs.filter((pr) => !pr.bot).map((pr) => pr.author))]
  const tag = toTag(version)

  return planned.map(({ repo, meta, base, titleTickets }) => ({
    repo,
    base,
    branch: AUTO_BRANCH,
    paths: repoPaths[repo],
    spec: `${UIC_PACKAGE}@^${tag.slice(1)}`,
    reviewers,
    title: buildTitle({ prefix: meta.title_prefix || 'chore:', version, tickets: titleTickets }),
    body: buildBody({ version, paths: repoPaths[repo], uicPrs }),
    commit_message: `${meta.commit_prefix || 'chore:'} update ${UIC_PACKAGE} to ${tag} (${titleTickets.join(', ')})`
  }))
}

const STABLE_TAG = /^v(\d+)\.(\d+)\.(\d+)$/

function compareStableTags(a, b) {
  const [pa, pb] = [a, b].map((tag) => tag.match(STABLE_TAG).slice(1).map(Number))
  return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2]
}

/**
 * True when `version` is still the highest stable weka-ui-components tag. An older release whose
 * run reaches the auto branch after a newer one must not move the auto PR back to its version.
 * Tags are compared instead of GitHub's "latest release", which can point at a beta.
 */
async function isLatestRelease({ github, core, version }) {
  const tag = toTag(version)
  try {
    const tags = await github.paginate(github.rest.repos.listTags, {
      owner: UIC_OWNER,
      repo: UIC_REPO,
      per_page: 100
    })
    const newer = tags
      .map((t) => t.name)
      .filter((name) => STABLE_TAG.test(name) && compareStableTags(name, tag) > 0)
      .sort(compareStableTags)
      .pop()
    if (!newer) return true
    core.notice(`${tag} is superseded by ${newer} — leaving the auto PRs to that release`)
    return false
  } catch (err) {
    core.warning(`Could not list release tags (${err.message}) — proceeding with ${tag}`)
    return true
  }
}

/**
 * Prepares `branch`: kept as-is while it has an open PR, otherwise (re)started from the base head,
 * so a branch left behind by a merged or closed auto PR never leaks old commits into a new one.
 */
async function ensureBranch({ github, core, repo, base, branch }) {
  const [owner, name] = repo.split('/')
  const [openPr] = await listOpenPrsForBranch({ github, repo, branch })
  if (openPr) {
    core.info(`${repo}:${branch} has open PR #${openPr.number} — reusing the branch`)
    return
  }

  const { data: baseRef } = await github.rest.git.getRef({
    owner,
    repo: name,
    ref: `heads/${base}`
  })
  const sha = baseRef.object.sha
  try {
    await github.rest.git.createRef({ owner, repo: name, ref: `refs/heads/${branch}`, sha })
    core.info(`Created ${repo}:${branch} from ${base}`)
  } catch (err) {
    if (err.status !== 422 || !/already exists/i.test(err.message)) throw err
    await github.rest.git.updateRef({ owner, repo: name, ref: `heads/${branch}`, sha, force: true })
    core.info(`Reset stale ${repo}:${branch} to ${base}`)
  }
}

/**
 * Opens the PR for `branch`, or retitles the open one, and requests review from the UIC PR authors.
 * Review-request failures (e.g. the token owner is the only author) are warnings, never errors.
 */
async function openPr({ github, core, repo, base, branch, title, body, reviewers }) {
  const [owner, name] = repo.split('/')
  const [existing] = await listOpenPrsForBranch({ github, repo, branch })

  let pr
  if (existing) {
    pr = (
      await github.rest.pulls.update({
        owner,
        repo: name,
        pull_number: existing.number,
        title,
        body
      })
    ).data
    core.notice(`Retargeted ${pr.html_url}`)
  } else {
    const { data: cmp } = await github.rest.repos.compareCommitsWithBasehead({
      owner,
      repo: name,
      basehead: `${base}...${branch}`
    })
    if (cmp.ahead_by === 0) {
      core.notice(`${repo} already uses this weka-ui-components version — no PR needed`)
      await github.rest.git.deleteRef({ owner, repo: name, ref: `heads/${branch}` }).catch(() => {})
      return
    }
    pr = (await github.rest.pulls.create({ owner, repo: name, base, head: branch, title, body }))
      .data
    core.notice(`Opened ${pr.html_url}`)
  }

  // GitHub rejects requesting review from the PR's own author (the token owner here).
  const author = pr.user.login.toLowerCase()
  const wanted = reviewers.filter((login) => login.toLowerCase() !== author)
  if (wanted.length < reviewers.length) {
    core.info(`Not requesting review from PR author ${pr.user.login}`)
  }

  // One request per reviewer: GitHub fails the whole call if any single login is not a collaborator.
  for (const login of wanted) {
    try {
      await github.rest.pulls.requestReviewers({
        owner,
        repo: name,
        pull_number: pr.number,
        reviewers: [login]
      })
      core.info(`Requested review from ${login}`)
    } catch (err) {
      core.warning(`Could not request review from ${login} on ${repo}#${pr.number}: ${err.message}`)
    }
  }
}

module.exports = {
  AUTO_BRANCH,
  planAutoPrs,
  isLatestRelease,
  ensureBranch,
  openPr,
  buildTitle,
  buildBody,
  pickTickets
}

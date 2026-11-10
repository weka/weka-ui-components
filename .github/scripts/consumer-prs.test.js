import { createRequire } from 'node:module'
import { describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const {
  AUTO_BRANCH,
  planAutoPrs,
  ensureBranch,
  openPr
} = require('./consumer-prs.cjs')

const REPO_META = {
  'weka/gohome': { title_prefix: 'feat:', ticket_pattern: 'WH-[0-9]{4,}' },
  'weka/wekapp': {
    commit_prefix: 'UI:',
    title_prefix: 'UI:',
    ticket_pattern: 'WEKAPP-[0-9]+',
    base: 'trunk/dev'
  }
}
const REPO_PATHS = {
  'weka/gohome': ['observe/frontend', 'frontend'],
  'weka/wekapp': ['build/packages/dashboard/files']
}
const UIC_PRS = {
  558: {
    number: 558,
    title: 'fix: search box (WH-4579)',
    user: { login: 'alice', type: 'User' }
  },
  9: {
    number: 9,
    title: 'chore: deps',
    user: { login: 'dependabot[bot]', type: 'Bot' }
  }
}

function makeCore() {
  return { info: vi.fn(), notice: vi.fn(), warning: vi.fn() }
}

function httpError(status, message) {
  return Object.assign(new Error(message), { status })
}

function makeGithub({ openAutoPrs = {} } = {}) {
  return {
    rest: {
      repos: {
        get: vi.fn(async () => ({ data: { default_branch: 'dev' } })),
        compareCommitsWithBasehead: vi.fn(async () => ({
          data: { ahead_by: 1 }
        }))
      },
      git: {
        getRef: vi.fn(async () => ({ data: { object: { sha: 'base-sha' } } })),
        createRef: vi.fn(async () => ({})),
        updateRef: vi.fn(async () => ({})),
        deleteRef: vi.fn(async () => ({}))
      },
      pulls: {
        get: vi.fn(async ({ pull_number }) => ({ data: UIC_PRS[pull_number] })),
        list: vi.fn(async ({ owner, repo }) => ({
          data: openAutoPrs[`${owner}/${repo}`]
            ? [openAutoPrs[`${owner}/${repo}`]]
            : []
        })),
        create: vi.fn(async () => ({
          data: { number: 77, html_url: 'url', user: { login: 'alice' } }
        })),
        update: vi.fn(async ({ pull_number }) => ({
          data: {
            number: pull_number,
            html_url: 'url',
            user: { login: 'bot-owner' }
          }
        })),
        requestReviewers: vi.fn(async () => ({}))
      }
    }
  }
}

function plan({
  github = makeGithub(),
  version = 'v4.74.0',
  tickets,
  prNumbers = '558,9',
  updates = []
}) {
  return planAutoPrs({
    github,
    core: makeCore(),
    version,
    tickets,
    prNumbers,
    repoMeta: REPO_META,
    repoPaths: REPO_PATHS,
    updates
  })
}

describe('planAutoPrs', () => {
  it('opens a PR only in the repo that owns the release ticket', async () => {
    const creates = await plan({ tickets: 'WH-4579' })

    expect(creates).toHaveLength(1)
    expect(creates[0]).toMatchObject({
      repo: 'weka/gohome',
      base: 'dev',
      branch: AUTO_BRANCH,
      spec: '@weka/weka-ui-components@^4.74.0',
      title: 'feat: update weka-ui-components to 4.74.0 (WH-4579)',
      commit_message:
        'chore: update @weka/weka-ui-components to v4.74.0 (WH-4579)',
      reviewers: ['alice']
    })
  })

  it('opens a wekapp PR on trunk/dev for a WEKAPP ticket', async () => {
    const creates = await plan({ tickets: 'WEKAPP-692143' })

    expect(
      creates.map(({ repo, base, title }) => ({ repo, base, title }))
    ).toEqual([
      {
        repo: 'weka/wekapp',
        base: 'trunk/dev',
        title: 'UI: update weka-ui-components to 4.74.0 (WEKAPP-692143)'
      }
    ])
  })

  it('opens nothing for a release without tickets or for a prerelease', async () => {
    expect(await plan({ tickets: '' })).toEqual([])
    expect(
      await plan({ tickets: 'WH-4579', version: 'v4.75.0-beta.0' })
    ).toEqual([])
  })

  it('skips a repo whose matching open PR targets its base branch', async () => {
    const updates = [
      { repo: 'weka/wekapp', number: 1, branch: 'x', base: 'trunk/dev' }
    ]

    const creates = await plan({ tickets: 'WH-4579,WEKAPP-1', updates })

    expect(creates.map((c) => c.repo)).toEqual(['weka/gohome'])
  })

  it('still opens a PR when the only matching PR is a backport', async () => {
    const updates = [
      { repo: 'weka/wekapp', number: 1, branch: 'x', base: 'trunk/v6.x' }
    ]

    const creates = await plan({ tickets: 'WEKAPP-1', updates })

    expect(creates.map((c) => c.repo)).toEqual(['weka/wekapp'])
  })

  it('retargets an open auto PR, keeping its earlier tickets, even without a new ticket', async () => {
    const github = makeGithub({
      openAutoPrs: {
        'weka/gohome': {
          number: 5,
          title: 'feat: update weka-ui-components to 4.73.0 (WH-1111)'
        }
      }
    })

    const creates = await plan({ github, tickets: 'WEKAPP-1' })

    expect(creates.map(({ repo, title }) => ({ repo, title }))).toEqual([
      {
        repo: 'weka/gohome',
        title: 'feat: update weka-ui-components to 4.74.0 (WH-1111)'
      },
      {
        repo: 'weka/wekapp',
        title: 'UI: update weka-ui-components to 4.74.0 (WEKAPP-1)'
      }
    ])
  })

  it('lists released PRs in the body without @mentions', async () => {
    const [create] = await plan({ tickets: 'WH-4579' })

    expect(create.body).toContain(
      '**fix: search box (WH-4579)** — weka/weka-ui-components#558 by `alice`'
    )
    expect(create.body).toContain('releases/tag/v4.74.0')
    expect(create.body).not.toContain('@alice')
    expect(create.body).not.toContain('@dependabot')
  })

  it('builds the release link from a version without the v prefix', async () => {
    const [create] = await plan({ tickets: 'WH-4579', version: '4.74.0' })

    expect(create.body).toContain('releases/tag/v4.74.0')
    expect(create.spec).toBe('@weka/weka-ui-components@^4.74.0')
  })

  it('does not load UIC PRs when no repo needs a PR', async () => {
    const github = makeGithub()

    await plan({ github, tickets: '' })

    expect(github.rest.pulls.get).not.toHaveBeenCalled()
  })
})

describe('ensureBranch', () => {
  const args = {
    core: makeCore(),
    repo: 'weka/gohome',
    base: 'dev',
    branch: AUTO_BRANCH
  }

  it('keeps the branch of an open auto PR untouched', async () => {
    const github = makeGithub({ openAutoPrs: { 'weka/gohome': { number: 5 } } })

    await ensureBranch({ github, ...args })

    expect(github.rest.git.createRef).not.toHaveBeenCalled()
    expect(github.rest.git.updateRef).not.toHaveBeenCalled()
  })

  it('resets a stale branch left by a closed auto PR to the base head', async () => {
    const github = makeGithub()
    github.rest.git.createRef.mockRejectedValue(
      httpError(422, 'Reference already exists')
    )

    await ensureBranch({ github, ...args })

    expect(github.rest.git.updateRef).toHaveBeenCalledWith(
      expect.objectContaining({ sha: 'base-sha', force: true })
    )
  })

  it('rethrows other 422 errors', async () => {
    const github = makeGithub()
    github.rest.git.createRef.mockRejectedValue(
      httpError(422, 'Reference name is invalid')
    )

    await expect(ensureBranch({ github, ...args })).rejects.toThrow('invalid')
  })
})

describe('openPr', () => {
  const args = {
    repo: 'weka/gohome',
    base: 'dev',
    branch: AUTO_BRANCH,
    title: 'feat: update weka-ui-components to 4.74.0 (WH-4579)',
    body: 'body'
  }

  it('does not request review from the PR author and does not fail', async () => {
    const github = makeGithub()

    await openPr({ github, core: makeCore(), ...args, reviewers: ['Alice'] })

    expect(github.rest.pulls.create).toHaveBeenCalled()
    expect(github.rest.pulls.requestReviewers).not.toHaveBeenCalled()
  })

  it('warns instead of failing when a reviewer cannot be requested', async () => {
    const github = makeGithub()
    github.rest.pulls.requestReviewers.mockImplementation(
      async ({ reviewers }) => {
        if (reviewers[0] === 'outsider')
          throw httpError(422, 'not a collaborator')
      }
    )
    const core = makeCore()

    await openPr({ github, core, ...args, reviewers: ['outsider', 'bob'] })

    expect(core.warning).toHaveBeenCalledOnce()
    expect(github.rest.pulls.requestReviewers).toHaveBeenLastCalledWith(
      expect.objectContaining({ reviewers: ['bob'] })
    )
  })

  it('retitles the open auto PR instead of opening another', async () => {
    const github = makeGithub({ openAutoPrs: { 'weka/gohome': { number: 5 } } })

    await openPr({ github, core: makeCore(), ...args, reviewers: [] })

    expect(github.rest.pulls.create).not.toHaveBeenCalled()
    expect(github.rest.pulls.update).toHaveBeenCalledWith(
      expect.objectContaining({ pull_number: 5, title: args.title })
    )
  })

  it('deletes the branch instead of opening an empty PR', async () => {
    const github = makeGithub()
    github.rest.repos.compareCommitsWithBasehead.mockResolvedValue({
      data: { ahead_by: 0 }
    })

    await openPr({ github, core: makeCore(), ...args, reviewers: ['bob'] })

    expect(github.rest.pulls.create).not.toHaveBeenCalled()
    expect(github.rest.git.deleteRef).toHaveBeenCalled()
  })
})

# WEKA UI Components

This package contains React components that should be used while developing UI for WEKA applications.

## Development

1. Run `yarn install` to install the necessary dependencies.
2. Run `yarn link` to create a symlink between the package and your local environment.
3. Inside the parent repository, run `yarn link "@weka/weka-ui-components"` to link the package.
4. Run the parent repository with the `--force` option to see changes.

## Release

To release a new version of the package:

1. Open a pull request to the `main` branch.
2. A new release will be created for each merged PR.

## Storybook

https://weka.github.io/weka-ui-components

## Run storybook locally

yarn run storybook

## Commits Naming

We are using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Here are some examples:

- `feat: commit message (ticket)` - Use this for commits that introduce a new feature to the codebase.
- `fix: commit message (ticket)` - Use this for commits that fix a bug in the codebase.
- `chore: commit message (ticket)` - Use this for commits related to routine tasks or maintenance chores in the codebase.

## Pull Requests Flow

1. Open a pull request to the `weka-ui-components`.
2. Inside parent repositories where you want to update the components, run `yarn add @weka.io/weka-ui-components@https://github.com/weka/weka-ui-components#<pr_branch_name>` with your PR branch name instead of `<pr_branch_name>`.
3. Open a PR for the parent repository.
4. After merging the components PR, inside parent repositories where you want to update the components, run `yarn add @weka.io/weka-ui-components@https://github.com/weka/weka-ui-components#<latest_tag>` with the tag instead of `<latest_tag>` .
5. Update PRs for parent repositories.

### Automatic consumer updates

Consumers are listed in `.github/consumer-targets.json` (`repo`, `path` of the frontend project, optional `commit_prefix`, default `chore:`): `weka/gohome` (`frontend`, `observe/frontend`) and `weka/wekapp` (`build/packages/dashboard/files`, commit prefix `UI:`). Optional per-repo settings for auto-opened PRs (set on any of the repo's entries): `title_prefix` (default `chore:`), `ticket_pattern` (the repo's own tickets: `WH-…` for gohome, `WEKAPP-…` for wekapp) and `base` (default: the repo's default branch).

- A `weka-ui-components` PR and a consumer PR that share a ticket (`WH-123` or `WEKAPP-123`, in the title or branch) are linked automatically: the consumer PR gets a commit pointing at the UIC PR head (`pr-preview-consumers.yml`), and after a release open consumer PRs with the release's tickets are bumped to the new version (`update-consumers.yml`).
- After a stable release (not beta/rc), every consumer repo whose own ticket (`ticket_pattern`) is in the release but has **no** such open PR on its base branch gets a PR that only bumps `@weka/weka-ui-components` (e.g. `UI: update weka-ui-components to 4.74.0 (WEKAPP-123)`; the released UIC PR titles go in the description), with review requested from the authors of the released UIC PRs. The token owner is never asked to review their own PR, and review-request failures only warn. These PRs always use the `auto/weka-ui-components` branch: while one is open, each later release retargets it (version, title, description) instead of opening another, and previews of unreleased UIC PRs are never pushed to it. If a newer stable release is already published when a run reaches the auto PR, the run bumps to that newer version instead, so the auto PR never moves back. Logic and tests: `.github/scripts/consumer-prs.cjs`.
- A consumer PR notifies this repo through the reusable `notify-consumer-pr.yml` workflow.

### Shared frontend CI for consumers

Consumers call reusable workflows from this repo instead of keeping their own copies:

```yaml
jobs:
  lint:
    uses: weka/weka-ui-components/.github/workflows/frontend-lint.yml@main
    with: { working_directory: frontend, project_title: WekaHome }
    secrets: { WEKA_COMPONENTS_NPM_TOKEN: ${{ secrets.WEKA_COMPONENTS_NPM_TOKEN }} }
```

- `frontend-lint.yml` runs ESLint, Stylelint, TypeScript and Prettier checks on changed lines and posts reviewdog comments. Inputs: `working_directory`, `project_title`, `node_version`, `tsc_flags`, `full_tree_checks`, `import_extensions_check`. Its scripts ship in this package under `plugins/ci/` (see `plugins/ci/README.md` for the `yarn` scripts a consumer must define); shared configs are exported as `@weka/weka-ui-components/stylelint` and `@weka/weka-ui-components/eslint-diff`.
- `notify-consumer-pr.yml` takes an optional `ticket_pattern` (default `(WH|WEKAPP)-[0-9]+`).

This repo is public, so any repo can call these workflows; the caller's Actions policy only has to allow workflows from `weka/*`.

## Dark Mode

### `index.html`

Add to the `head` element:

```html
<style>
  /* optimization to remove flickering between reloads */
  html {
    background: #f5f5f5;
  }

  html.dark-mode {
    background: #3d3d3d;
  }

  @media (prefers-color-scheme: dark) {
    html {
      background: #3d3d3d;
    }
  }

  html.light-mode {
    background: #f5f5f5;
  }
</style>
```

Add above all other scripts inside the `body` element:

```html
<script>
  // optimization to remove flickering between reloads
  const savedDarkMode = localStorage.getItem('isDarkMode')

  if (savedDarkMode) {
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark-mode')
      document.body.classList.add('dark-mode')
    } else if (savedDarkMode === 'false') {
      document.documentElement.classList.add('light-mode')
      document.body.classList.add('light-mode')
    }

    window.addEventListener('DOMContentLoaded', () => {
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.remove('light-mode')
    })
  }
</script>
```

### Usage

Wrap your app with `DarkModeProvider` and call `useDarkMode` for getting the current value.

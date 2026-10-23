# CI scripts

Diff-scoped lint scripts shared by consumers of `@weka/weka-ui-components`. They ship in the package and are run from the installed copy, e.g.

```bash
bash node_modules/@weka/weka-ui-components/plugins/ci/tsc-changed.sh
```

Consumers get them in CI through the reusable workflow `.github/workflows/frontend-lint.yml`; the same scripts back the local `yarn` commands below. All scripts find their siblings relative to their own location, so they work from any cwd.

"Changed lines" is defined once, in `changed-lines.sh`: lines added relative to `BASE_REF` across committed (`BASE_REF...HEAD`), staged and unstaged changes. Local runs and CI (reviewdog `-filter-mode=added`) therefore agree.

## Local scripts (run from the project directory)

| Script | Env | Exit codes |
| --- | --- | --- |
| `tsc-changed.sh` | `BASE_REF` (required), `TSC_FLAGS` (default `--noEmit`; `-b` for project references) | 0 clean, 1 errors on changed lines, 2 tsc could not run |
| `stylelint-changed.sh [--fix]` | `BASE_REF` (required); needs `jq` | 0 clean/warnings only, 1 errors, 2 stylelint could not run |
| `prettier-changed.sh [--fix]` | `BASE_REF` (required) | 0 clean or nothing changed, 1 formatting issues, 2 bad usage |
| `eslint-ci.sh` | `ESLINT_PLUGIN_DIFF_COMMIT` (diff mode when set) | eslint's |
| `stylelint-ci.sh` | none | 0 clean, 1 auto-fixable issues were not fixed |

`prettier-changed.sh` is for projects with existing formatting debt that cannot run a full-tree `prettier --check`.

## CI scripts (called by `frontend-lint.yml`)

Common env: `BASE_REF` (e.g. `origin/dev`), `WORKING_DIR` (project dir relative to the repo root), `GITHUB_WORKSPACE`; optional `RDJSONL_OUT`. Each writes rdjsonl for the aggregator and `total` (plus `errors` for ESLint/Stylelint) to `$GITHUB_OUTPUT`.

| Script | Notes |
| --- | --- |
| `reviewdog-eslint.sh` | Needs `eslint.diff.config.{mjs,js}` in the project. Exit 1 on ESLint errors; warnings are posted. |
| `reviewdog-stylelint.sh` | Changed `.scss` files; errors fail, warnings are posted on changed lines. |
| `reviewdog-tsc.sh` | Wraps `tsc-changed.sh`; `TSC_FLAGS` passes through. Type errors are advisory; exit 1 only if tsc could not run. |
| `reviewdog-aggregator.sh` | Applies `TOTAL_CAP` across tools, posts inline comments and one PR summary. Also takes `PRETTIER_FIX_CMD` (default `yarn format`), `PROJECT_TITLE`, `PR_NUMBER`, `*_TOTAL`, `*_ERRORS`, `*_RESULT`. |

## What the consumer defines

The local-fix hints in the PR summary name these `package.json` scripts, so a consumer must define them:

```json
{
  "scripts": {
    "lint:diff": "ESLINT_PLUGIN_DIFF_COMMIT=${BASE_REF:-origin/dev} eslint . --config eslint.diff.config.mjs",
    "lint:diff:fix": "ESLINT_PLUGIN_DIFF_COMMIT=${BASE_REF:-origin/dev} eslint . --config eslint.diff.config.mjs --fix",
    "style:diff": "BASE_REF=${BASE_REF:-origin/dev} bash node_modules/@weka/weka-ui-components/plugins/ci/stylelint-changed.sh",
    "style:diff:fix": "BASE_REF=${BASE_REF:-origin/dev} bash node_modules/@weka/weka-ui-components/plugins/ci/stylelint-changed.sh --fix",
    "ts:diff": "BASE_REF=${BASE_REF:-origin/dev} bash node_modules/@weka/weka-ui-components/plugins/ci/tsc-changed.sh",
    "format": "prettier --write .",
    "formatcheck": "prettier --check .",
    "format:diff": "BASE_REF=${BASE_REF:-origin/dev} bash node_modules/@weka/weka-ui-components/plugins/ci/prettier-changed.sh --fix"
  }
}
```

`formatcheck` is used when `full_tree_checks` is true; `format:diff` is the hint when it is false. The project also needs `eslint.diff.config.mjs` (`export default withDiff(baseConfig)` with `withDiff` from `@weka/weka-ui-components/eslint-diff`), a stylelint config re-exporting `@weka/weka-ui-components/stylelint`, and its own `stylelint`, `stylelint-config-standard-scss` and `eslint-plugin-diff` devDependencies.

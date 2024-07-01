# WEKA UI Components

This package contains React components that should be used while developing UI for WEKA applications.

## Development

1. Run `yarn install` to install the necessary dependencies.
2. Run `yarn link` to create a  symlink between the package and your local environment.
3. Inside the parent repository, run `yarn link "@weka/weka-ui-components"` to link the package.
4. Run the parent repository with the `--force` option to see changes.

## Release

To release a new version of the package:

1. Open a pull request to the `main` branch.
2. A new release will be created for each merged PR.

## Commits Naming

We are using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Here are some examples:

- `feat: commit message (ticket)` - Use this for commits that introduce a new feature to the codebase.
- `fix: commit message (ticket)` - Use this for commits that fix a bug in the codebase.
- `chore: commit message (ticket)` - Use this for commits related to routine tasks or maintenance chores in the codebase.

## Pull Requests Flow

1. Open a pull request to the `weka-ui-components`.
2. Inside parent repositories where you want to update the components, run `yarn add @weka.io/weka-ui-components@https://github.com/weka/weka-ui-components#<pr_branch_name>` with your PR branch name instead of `<pr_branch_name>`.
3. Open a PR for the parent repository.
4. After merging the components PR, wait a few minutes for release and get the latest tag from [here](https://github.com/weka/weka-ui-components/tags).
5. Inside parent repositories where you want to update the components, run `yarn add @weka.io/weka-ui-components@https://github.com/weka/weka-ui-components#<latest_tag>` with the tag instead of `<latest_tag>` .
6. Update PRs for parent repositories.

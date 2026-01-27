# Versioning & Publishing Guide

This package uses [Semantic Versioning](https://semver.org/) and is published to GitHub Packages.

## Version Format

**`MAJOR.MINOR.PATCH`** (e.g., `4.0.0`)

| Type | When to bump | Example | Meaning |
|------|--------------|---------|---------|
| **PATCH** | Bug fixes, safe changes | `4.0.0` → `4.0.1` | No breaking changes |
| **MINOR** | New features, backward compatible | `4.0.1` → `4.1.0` | New stuff added, existing stuff unchanged |
| **MAJOR** | Breaking changes | `4.1.0` → `5.0.0` | May break existing code in parent projects |

---

## Examples of Each Version Type

### PATCH (bug fixes)
- Fix a CSS styling issue
- Fix a typo in a prop name's JSDoc
- Fix a component not rendering correctly

### MINOR (new features, backward compatible)
- Add a new v2 component (e.g., `TextField`)
- Add a new optional prop to an existing component
- Add a new hook or utility function
- Deprecate something (but keep it working)

### MAJOR (breaking changes)
- Remove a component or prop
- Rename an exported component
- Change a component's required props
- Change default behavior of a component
- Remove or rename CSS variables that parent projects depend on

---

## How to Publish

### One Command (Recommended)

```bash
# For bug fixes
yarn release:patch    # 4.0.0 → 4.0.1

# For new features
yarn release:minor    # 4.0.1 → 4.1.0

# For breaking changes
yarn release:major    # 4.1.0 → 5.0.0
```

That's it! The command will:
1. Bump the version in package.json
2. Create a git commit and tag
3. Push to GitHub

Then GitHub Actions automatically:
- Builds the package
- Runs tests
- Publishes to GitHub Packages
- Creates a GitHub Release with auto-generated notes

### Manual Alternative

```bash
# 1. Update version
yarn version patch   # or minor, or major

# 2. Push changes and tag
git push && git push --tags
```

The GitHub Action handles the rest.

---

## How Parent Projects Receive Updates

Parent projects use semver ranges:

```json
{
  "dependencies": {
    "@weka/weka-ui-components": "^4.0.0"
  }
}
```

### What `^4.0.0` means:

| You publish | Parent gets it? | Why |
|-------------|-----------------|-----|
| `4.0.1` | ✅ Yes (auto) | Patch update |
| `4.1.0` | ✅ Yes (auto) | Minor update |
| `4.9.9` | ✅ Yes (auto) | Still 4.x.x |
| `5.0.0` | ❌ No | Major - requires manual update |

### Parent project commands:

```bash
# Check for available updates
yarn outdated @weka/weka-ui-components

# Update to latest within range (4.x.x)
yarn up @weka/weka-ui-components

# Update to specific version
yarn add @weka/weka-ui-components@4.2.0

# Update to new major version (when ready)
yarn add @weka/weka-ui-components@^5.0.0
```

---

## Migration from Git URLs

Parent projects currently use:
```json
"@weka/weka-ui-components": "https://github.com/weka/weka-ui-components.git#3.198.0"
```

To switch to semver:
```json
"@weka/weka-ui-components": "^4.0.0"
```

**Requirements:**
1. `.npmrc` must have GitHub Packages auth configured:
   ```
   @weka:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```
2. `NPM_TOKEN` environment variable (or use `gh auth` for local development)

---

## Development Workflow

### Testing locally (before publishing)

1. In weka-ui-components:
   ```bash
   yarn build
   ```

2. In parent project:
   ```bash
   yarn link ../path/to/weka-ui-components
   yarn dev
   ```

3. Test your changes

4. Unlink when done:
   ```bash
   yarn unlink ../path/to/weka-ui-components
   ```

### Pre-release versions (beta testing)

For testing in production-like environment before official release:

```bash
# Publish a beta version
yarn version 4.1.0-beta.1
yarn build
yarn npm publish --tag beta
```

Parent project can test with:
```bash
yarn add @weka/weka-ui-components@beta
# or specific version
yarn add @weka/weka-ui-components@4.1.0-beta.1
```

---

## v1 vs v2 Components

This package has two component systems:

| | v1 | v2 |
|---|---|---|
| Import | `import { Button } from '@weka/weka-ui-components'` | `import { Button } from '@weka/weka-ui-components/v2'` |
| Source | `lib/components/` | `lib/v2/components/` |
| Styles | Global SCSS | CSS Modules |
| Tests | None | Vitest |
| Status | Legacy (maintained) | New (active development) |

Both are versioned together in the same package.

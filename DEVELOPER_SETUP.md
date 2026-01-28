# Developer Setup Guide

This guide explains how to set up your local environment to work with `@weka/weka-ui-components`.

## For Parent Project Developers

If you're working on a project that **uses** weka-ui-components, follow these steps.

### One-Time Setup

#### 1. Create a GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Select **"Classic"** token
3. Name: `weka-packages-read` (or any name you prefer)
4. Expiration: **No expiration** (recommended for read-only)
5. Scopes: Select only **`read:packages`**
6. Click **"Generate token"**
7. Copy the token (starts with `ghp_...`)

#### 2. Authorize for SSO

1. On the [tokens page](https://github.com/settings/tokens), find your new token
2. Click **"Configure SSO"**
3. Click **"Authorize"** next to `weka`

#### 3. Configure Your Environment

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export WEKA_COMPONENTS_NPM_TOKEN="ghp_YOUR_TOKEN_HERE"
```

Then reload:
```bash
source ~/.zshrc
```

In the parent project's `.yarnrc.yml`, use the variable:
```yaml
npmScopes:
  weka:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${WEKA_COMPONENTS_NPM_TOKEN}"
```

### Verify Setup

```bash
cd ~/Projects/gohome/observe/frontend  # or your parent project
yarn add @weka/weka-ui-components@4.0.0
```

If you see "Package not found" or 403 errors, double-check:
- Token has `read:packages` scope
- Token is authorized for SSO (step 2)
- Environment variable is set (`echo $WEKA_COMPONENTS_NPM_TOKEN`)

---

## For weka-ui-components Developers

If you're developing **weka-ui-components itself**, follow these additional steps.

### Local Development with yarn link

To test changes in a parent project without publishing:

```bash
# Terminal 1: In weka-ui-components
cd ~/Projects/weka-ui-components
yarn build  # Build first

# Terminal 2: In parent project
cd ~/Projects/gohome/observe/frontend
yarn link ../../../weka-ui-components
yarn dev
```

Changes in `weka-ui-components/lib/v2/` will hot-reload in the parent project.

When done:
```bash
yarn unlink ../../../weka-ui-components
yarn install
```

### Publishing a New Version

See [VERSIONING.md](./VERSIONING.md) for full details.

**Quick reference:**
```bash
yarn release:patch    # Bug fixes: 4.0.0 → 4.0.1
yarn release:minor    # New features: 4.0.1 → 4.1.0
yarn release:major    # Breaking changes: 4.1.0 → 5.0.0
yarn release:beta     # Beta: 4.0.0-beta.1 → 4.0.0-beta.2
```

### Publishing a Beta Version

For testing before official release:

```bash
yarn release:beta
```

This will:
- Increment beta version (`4.0.0-beta.1` → `4.0.0-beta.2`)
- Create git commit and tag
- Push to GitHub
- GitHub Action publishes automatically

Parent projects can test with:
```bash
yarn add @weka/weka-ui-components@4.0.0-beta.2
```

---

## CI/CD Setup for Parent Projects

GitHub Actions automatically have access via `GITHUB_TOKEN`. Add this to your workflow:

```yaml
- name: Install dependencies
  run: yarn install
  env:
    WEKA_COMPONENTS_NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

And ensure `.yarnrc.yml` has:
```yaml
npmScopes:
  weka:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${WEKA_COMPONENTS_NPM_TOKEN}"
```

---

## Troubleshooting

### "Package not found" (404)

- Check the version exists: https://github.com/weka/weka-ui-components/packages
- Ensure `.yarnrc.yml` has the correct registry URL

### "Forbidden" (403)

- Token doesn't have `read:packages` scope → create a new one
- Token not authorized for SSO → go to tokens page and authorize
- Environment variable not set → check `echo $WEKA_COMPONENTS_NPM_TOKEN`

### "The remote server failed to provide the requested resource"

Same as 403 - authentication issue. Check token and SSO authorization.

---

## Quick Reference

| Task | Command |
|------|---------|
| Install package | `yarn add @weka/weka-ui-components@^4.0.0` |
| Update to latest | `yarn up @weka/weka-ui-components` |
| Link for local dev | `yarn link ../path/to/weka-ui-components` |
| Unlink | `yarn unlink ../path/to/weka-ui-components` |
| Release patch | `yarn release:patch` |
| Release minor | `yarn release:minor` |
| Release major | `yarn release:major` |
| Release beta | `yarn release:beta` |
| Check token | `echo $WEKA_COMPONENTS_NPM_TOKEN` |

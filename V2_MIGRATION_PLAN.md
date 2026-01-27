# weka-ui-components v2 Structure & Distribution Plan

## Chosen Approach

**Same package, new entry point:**
- v1 stays exactly as-is (git URL, source-based, alias workarounds in parent projects)
- v2 is a new entry point (`@weka/weka-ui-components/v2`) with proper build, no aliases
- v2 can reuse hooks, utils, svgs from existing codebase

```typescript
// v1 (existing - unchanged)
import { Button } from '@weka/weka-ui-components'

// v2 (new - properly built, no workarounds)
import { Button } from '@weka/weka-ui-components/v2'
```

---

## Problem Summary (For Reference)

### Why NPM Package Didn't Work (Root Cause)

The real issue is **unresolved TypeScript path aliases** inside the library:

```typescript
// Inside weka-ui-components, code does this:
import { something } from 'utils'      // Path alias, not a real package
import { something } from 'context'    // Same
import { something } from 'hooks'      // Same
import { something } from 'consts'     // Same
import { something } from 'svgs'       // Same
```

These aliases are defined in `tsconfig.json`:
```json
"paths": {
  "utils": ["./lib/utils.tsx"],
  "context": ["./lib/context/index.ts"],
  "hooks": ["./lib/hooks/index.ts"],
  "consts": ["./lib/consts.ts"],
  "svgs": ["./lib/svgs/index.ts"]
}
```

**The problem:** When installed in `node_modules`, these aliases don't resolve because:
1. They're not real npm packages
2. TypeScript path aliases are compile-time only - they don't transform the output
3. The built `dist/` still contains `import from 'utils'` which fails at runtime

**Current workaround:** Parent projects manually re-map these aliases in their Vite config:
```typescript
// weka_worktree/build/packages/dashboard/files/vite.config.ts
resolve: {
  alias: {
    utils: resolve(__dirname, './node_modules/@weka/weka-ui-components/lib/utils.tsx'),
    context: resolve(__dirname, './node_modules/@weka/weka-ui-components/lib/context/index.ts'),
    // ... repeated for all aliases
  }
}
```

This is why you publish `lib/` (source) instead of `dist/` - the source + parent's Vite aliases make it work.

### Secondary Issues
- SCSS files imported directly in components (`import './button.scss'`)
- Parent projects must process these with their Vite SCSS pipeline
- No proper `exports` field in package.json

### Current Update Process (Cumbersome)

1. Merge changes to main
2. New tag created automatically (e.g., `3.198.0`)
3. Manually update git URL in each parent project's `package.json`
4. Open PR in each of the 4-5 parent projects

---

## Solution Overview

1. **Leave v1 as-is** - Keep working with git URLs and parent alias workarounds
2. **Create v2 structure** - New folder with proper setup (no path aliases, relative imports)
3. **Add v2 entry point** - Separate export at `@weka/weka-ui-components/v2`
4. **Add testing** - Vitest setup for v2 components
5. **Automate updates** - GitHub Action to create PRs in parent projects on release (optional)

---

## Part 1: v2 Components - No Path Aliases

v2 components will use **relative imports** only:

```typescript
// v2 components do this:
import { useToggle } from '../../../hooks'        // Relative to existing hooks
import { CloseIcon } from '../../../svgs'         // Relative to existing svgs
import { someUtil } from '../../../utils'         // Relative to existing utils

// NOT this (path aliases - causes the v1 problem):
import { useToggle } from 'hooks'  // ❌ Don't use in v2
```

This means:
- v2 works when built to `dist/` without any workarounds
- v2 can still reuse hooks, utils, svgs from the existing codebase
- No changes needed to v1 or parent projects' v1 usage

---

## Part 2: Package Configuration (v1 unchanged, v2 added)

### package.json Changes

Keep v1 working via source, add v2 with development/production modes:

```json
{
  "name": "@weka/weka-ui-components",
  "type": "module",
  "module": "lib/main.ts",
  "types": "lib/main.ts",
  "files": ["lib", "dist"],
  "exports": {
    ".": {
      "import": "./lib/main.ts",
      "types": "./lib/main.ts"
    },
    "./v2": {
      "development": "./lib/v2/index.ts",
      "default": "./dist/v2/index.js",
      "types": "./dist/v2/index.d.ts"
    },
    "./v2/styles.css": "./dist/v2/style.css"
  },
  "sideEffects": ["*.css", "*.scss"]
}
```

**Key points:**
- `.` (v1) still points to `lib/` source - unchanged behavior
- `./v2` has **two modes**:
  - `development` → source (`lib/v2/index.ts`) - for `yarn link` workflow
  - `default` → built (`dist/v2/index.js`) - for production builds
- Both `lib` and `dist` included in `files`

### Development Workflow (yarn link)

**No additional workarounds needed!** Parent projects already have smart aliases:

```typescript
// In parent's vite.config.ts (already exists)
const isFromWekaUI = (importer: string): boolean =>
  importer.includes('weka-ui-components')

// When v2 code imports 'utils', resolver checks:
// - importer = "node_modules/@weka/weka-ui-components/lib/v2/components/Button.tsx"
// - isFromWekaUI(importer) = true ✓
// - resolves to lib/utils.tsx ✓
```

The existing aliases work for v2 because v2 code is still under `@weka/weka-ui-components`.

### vite.config.ts Changes

Only build v2 (v1 is used as source):

```typescript
build: {
  lib: {
    entry: {
      'v2/index': 'lib/v2/index.ts'
    },
    formats: ['es']
  },
  rollupOptions: {
    external: [
      'react', 'react-dom', 'react-router-dom',
      '@emotion/react', '@emotion/styled',
      '@mui/material', 'luxon'
    ],
    output: {
      preserveModules: true,
      preserveModulesRoot: 'lib/v2'
    }
  }
}
```

---

## Part 3: v2 Components Structure

```
lib/
├── components/              # v1 (existing, unchanged)
├── v2/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.module.scss
│   │   ├── TextField/
│   │   │   └── ...
│   │   └── index.ts         # barrel export
│   ├── hooks/
│   │   └── index.ts
│   ├── styles/
│   │   └── theme.scss
│   └── index.ts             # v2 main entry
├── main.ts                  # v1 entry (unchanged)
└── v2.ts                    # → re-exports from v2/index.ts
```

### Usage in Parent Projects

```typescript
// v1 (backward compatible - existing behavior)
import { Button } from '@weka/weka-ui-components'

// v2 (new redesigned components)
import { Button } from '@weka/weka-ui-components/v2'
```

### Component Template

Each v2 component folder contains:

| File | Purpose |
|------|---------|
| `Component.tsx` | Component implementation |
| `Component.test.tsx` | Vitest tests |
| `Component.stories.tsx` | Storybook stories |
| `Component.module.scss` | Scoped styles |

---

## Part 4: Testing Setup (Vitest)

### New Files

**vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['lib/**/*.test.{ts,tsx}']
  }
})
```

**vitest.setup.ts**
```typescript
import '@testing-library/jest-dom'
```

### Example Test

```typescript
// lib/v2/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

### package.json Scripts

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest --coverage"
}
```

---

## Part 5: Automated Updates (GitHub Actions) - Optional

### New Workflow: `.github/workflows/update-dependents.yml`

When a new version is released, automatically create PRs in parent projects:

```yaml
name: Update Dependent Projects

on:
  release:
    types: [published]

jobs:
  update-dependents:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        repo:
          - weka/parent-project-1
          - weka/parent-project-2
          - weka/parent-project-3
          # Add all parent repos here

    steps:
      - uses: actions/checkout@v4
        with:
          repository: ${{ matrix.repo }}
          token: ${{ secrets.REPO_ACCESS_TOKEN }}

      - name: Update package.json
        run: |
          VERSION="${{ github.event.release.tag_name }}"
          # Use jq or sed to update the version
          jq '.dependencies["@weka/weka-ui-components"] = "^'$VERSION'"' package.json > tmp.json
          mv tmp.json package.json

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.REPO_ACCESS_TOKEN }}
          title: "chore(deps): update weka-ui-components to ${{ github.event.release.tag_name }}"
          body: |
            Automated update of @weka/weka-ui-components to ${{ github.event.release.tag_name }}

            Release notes: ${{ github.event.release.html_url }}
          branch: deps/weka-ui-components-${{ github.event.release.tag_name }}
          commit-message: "chore(deps): update weka-ui-components to ${{ github.event.release.tag_name }}"
```

### Setup Required

1. Create a GitHub Personal Access Token (PAT) with `repo` scope
2. Add it as a secret named `REPO_ACCESS_TOKEN` in weka-ui-components repo
3. The PAT must have access to all parent repositories

### Using v2 in Parent Projects

v2 requires NO changes to parent project configuration. Just import:

```typescript
// v2 components - no vite alias workarounds needed
import { Button } from '@weka/weka-ui-components/v2'
import '@weka/weka-ui-components/v2/styles.css'
```

v1 continues working exactly as before with existing git URL and alias workarounds.

---

## Implementation Phases

### Phase 1: v2 Folder Structure
- [ ] Create `lib/v2/` folder structure
- [ ] Create `lib/v2/index.ts` barrel export
- [ ] Create `lib/v2/components/index.ts` components barrel
- [ ] Create example Button component (using relative imports only!)

### Phase 2: Build Configuration
- [ ] Update `vite.config.ts` to build v2 entry point
- [ ] Run `yarn build` and verify `dist/v2/` is created
- [ ] Verify no path alias imports in built output (`grep -r "from 'utils'" dist/`)

### Phase 3: Package Configuration
- [ ] Update `package.json` with `exports` field for v2
- [ ] Add `dist` to `files` array (keep `lib` too)
- [ ] Test with `npm pack --dry-run`

### Phase 4: Testing Setup
- [ ] Install vitest and @testing-library/react
- [ ] Create `vitest.config.ts`
- [ ] Create `vitest.setup.ts`
- [ ] Add test scripts to package.json
- [ ] Write test for example Button component

### Phase 5: Storybook
- [ ] Update `.storybook/main.js` to include v2 stories
- [ ] Create story for example Button component
- [ ] Verify storybook shows v2 components

### Phase 6: Verification
- [ ] Test in a parent project: `import { Button } from '@weka/weka-ui-components/v2'`
- [ ] Verify v1 still works unchanged via git URL
- [ ] Document usage for team

---

## Verification Checklist

### 1. v2 Build Output (no path aliases!)
```bash
yarn build
# Check for unresolved aliases in v2:
grep -r "from 'utils'" dist/v2/
grep -r "from 'context'" dist/v2/
grep -r "from 'hooks'" dist/v2/
# Should return NO results - all imports should be relative
```

### 2. Package Contents
```bash
npm pack --dry-run
# Should show BOTH lib/ and dist/ files
```

### 3. v1 Still Works (unchanged)
```bash
# In parent project, using git URL:
# "@weka/weka-ui-components": "https://github.com/weka/weka-ui-components.git#X.X.X"
import { Button } from '@weka/weka-ui-components'  # Should work with existing alias workarounds
```

### 4. v2 Works - Development Mode (with yarn link)
```bash
# In weka-ui-components:
yarn link

# In parent project:
yarn link @weka/weka-ui-components
yarn dev  # Vite uses "development" condition → source files

# Changes in weka-ui-components/lib/v2/ should hot-reload in parent
```

### 5. v2 Works - Production Mode (no workarounds)
```bash
# In parent project:
yarn build  # Vite uses "default" condition → dist files

# Should work WITHOUT any new alias configuration
# (existing aliases for v1 also cover v2 during development)
```

### 6. Tests Pass
```bash
yarn test
```

### 7. Storybook Works
```bash
yarn storybook
# Should show both v1 and v2 components
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Fix exports, files, main, module |
| `vite.config.ts` | Modify | Multiple entry points |
| `vitest.config.ts` | Create | Test configuration |
| `vitest.setup.ts` | Create | Test setup |
| `lib/v2/index.ts` | Create | v2 barrel export |
| `lib/v2/components/index.ts` | Create | Components barrel |
| `lib/v2/components/Button/Button.tsx` | Create | Example component |
| `lib/v2/components/Button/Button.test.tsx` | Create | Example test |
| `lib/v2/components/Button/Button.stories.tsx` | Create | Example story |
| `.github/workflows/update-dependents.yml` | Create | Auto-update workflow |
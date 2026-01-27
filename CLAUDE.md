# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WEKA UI Components is a React component library for WEKA applications. It provides reusable UI components with built-in dark mode support, form validation, and WEKA-specific patterns.

**Primary consumers:**
- `<weka-repo>/build/packages/dashboard/files` - Main WEKA dashboard (112 files, extensive v1 usage)
- `<gohome-repo>/observe/frontend` - Observe application (lighter usage, migrating to v2)

## Commands

```bash
# Install dependencies
yarn install

# Development - run Storybook locally
yarn storybook

# Build the library
yarn build

# Run tests
yarn test              # Watch mode
yarn test:run          # Single run
yarn test:coverage     # With coverage

# Linting and formatting
yarn lint              # ESLint (./lib directory)
yarn format            # Prettier

# Build Storybook for deployment
yarn build-storybook
```

## Architecture

### Dual Version Structure

The library has two entry points:
- **v1** (`lib/main.ts`): Current stable components using SCSS, path aliases, and MUI integration
- **v2** (`lib/v2/index.ts`): Redesigned components using CSS Modules, relative imports, and Vitest tests

**Migration strategy:** Components from observe/frontend will gradually move to v2. New components should be built in v2 with CSS Modules and relative imports.

### Key Directories

- `lib/components/`: v1 React components (Button, Table, TextEditor, inputs, etc.)
- `lib/v2/components/`: v2 redesigned components
- `lib/context/`: React contexts (`DarkModeProvider`, `DialogProvider`)
- `lib/hooks/`: Shared hooks (`useDebounce`, `useToggle`, `useKeyEvent`, etc.)
- `lib/consts.ts`: Shared constants (severities, statuses, time formats, form validations)
- `lib/utils.tsx`: Utility functions (formatting, validation, toast notifications)
- `lib/svgs/`: SVG icon components
- `lib/style/`: Global SCSS themes and styles

### Path Aliases (v1 only)

Defined in `tsconfig.json`:
- `context` → `./lib/context/index.ts`
- `consts` → `./lib/consts.ts`
- `svgs` → `./lib/svgs/index.ts`
- `hooks` → `./lib/hooks/index.ts`
- `utils` → `./lib/utils.tsx`

**Note:** v2 components must use relative imports instead of path aliases.

### Build Configuration

- Vite builds both v1 and v2 entry points as ES modules
- CSS is automatically injected via `vite-plugin-lib-inject-css`
- TypeScript declarations generated with `vite-plugin-dts`
- External peer dependencies: React, React DOM, React Router DOM, Emotion, MUI, Luxon

### Testing

- v2 components use Vitest with `happy-dom` environment
- Tests located alongside components (`*.test.tsx`)
- React Testing Library for component testing

## Most Used Components

### By dashboard (primary consumer - 112 files)

**Very high usage:**
- `svgs` - Icon library (41 files) - `Arrow`, `AddThin`, `Delete`, `View`, `Hide`, `Monitor`, etc.
- `Tooltip` / `SpanTooltip` - Help text and truncated text with tooltips (29+ usages)
- Control components with react-hook-form - `ControlSelect`, `ControlTextBox`, `ControlTextArea`, `ControlSwitch`, `ControlFileUpload`, `ControlJson` (345+ instances)

**High usage:**
- `Loader` - Loading states (21+ usages)
- `Button` - Primary interactions
- `Utils` (as `componentsUtils`) - Toast notifications (`toastSuccess`, `toastError`, `closeDialog`)
- `Table` + `createColumnHelper` - Data tables with sorting, filtering, row actions
- `MUItheme` - Material-UI theme configuration

**Medium usage:**
- `Tab` - Section navigation
- `StatusCell` - Table cell for status rendering
- `MenuPopper` - Dropdown menus
- `FormWrapperDialog` - Form-based dialogs
- Form inputs: `TextField`, `TextBox`, `Select`, `FormSwitch`, `RadioSwitch`, `TagsBox`, `IpTextBox`, `IpSubnetTextBox`, `TextArea`

### By observe/frontend

**High usage:**
- `createColumnHelper` + Table components - TanStack React-Table integration
- `DarkModeProvider` / `useDarkMode` - Theme management (30+ usages)
- `DialogProvider` + `ToasterDialog` - Modal and notification dialogs

**Medium usage:**
- `TextEditor` - JSON/code display with syntax highlighting
- `Collapsible` - Expandable sections with header actions
- `Loader` - Loading states and Suspense fallbacks

## Consumer Integration

### Import Patterns

```typescript
// v1 imports (current)
import { DarkModeProvider, useDarkMode, Table, TextEditor } from '@weka/weka-ui-components'

// v2 imports (preferred for new code)
import { Button } from '@weka/weka-ui-components/v2'

// Type imports
import type { SortingFn } from '@weka/weka-ui-components'
```

### Provider Setup (App.tsx)

```tsx
<DarkModeProvider>
  <ErrorBoundary fallback={<ErrorPage />}>
    <BrowserRouter>
      <ThemeProvider theme={MUItheme}>
        <QueryClientProvider>
          <DialogProvider>
            {/* App content */}
            <ToasterContainer />
            <ToasterDialog />
          </DialogProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ErrorBoundary>
</DarkModeProvider>
```

### Constants Re-export Pattern

Consumer apps typically re-export constants for local use:

```typescript
import { consts as componentsConsts } from '@weka/weka-ui-components'

const {
  EMPTY_STRING, GENERAL_ERROR, SEVERITIES, SEVERITY_CRITICAL,
  CAPACITY, TIMES_SECONDS, TIME_FORMATS, SAVED_FILTERS
} = componentsConsts
```

### Form Integration with react-hook-form

Control components integrate with react-hook-form's Controller:

```tsx
import { ControlTextBox, ControlSelect, ControlSwitch } from '@weka/weka-ui-components'

// In FormWrapperDialog or custom forms
<Controller
  name="fieldName"
  control={control}
  render={({ field }) => (
    <ControlTextBox {...field} error={errors.fieldName} required />
  )}
/>
```

### Table with Row Actions

```tsx
import { Table, createColumnHelper, StatusCell } from '@weka/weka-ui-components'

const columnHelper = createColumnHelper<DataType>()

const columns = [
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusCell status={info.getValue()} />,
    enableSorting: true,
    enableColumnFilter: true,
    meta: { filter: { type: 'select', options: statusOptions } }
  }),
]

<Table
  data={data}
  columns={columns}
  rowActions={[
    { text: 'Edit', action: handleEdit },
    { text: 'Delete', action: handleDelete, hideAction: (row) => !row.canDelete }
  ]}
  defaultSort={[{ id: 'name', desc: false }]}
/>
```

### Consumer Vite Configuration

Consumer projects need custom resolution for path aliases. Example from observe/frontend `vite.config.ts`:

```typescript
// Required to resolve internal path aliases used by weka-ui-components
customResolver(source) {
  if (source === 'utils') return '/path/to/weka-ui-components/lib/utils.tsx'
  if (source === 'consts') return '/path/to/weka-ui-components/lib/consts.ts'
  if (source === 'svgs') return '/path/to/weka-ui-components/lib/svgs/index.ts'
  if (source === 'hooks') return '/path/to/weka-ui-components/lib/hooks/index.ts'
  // ...
}
```

### Consumer Test Mocking

The package requires mocking in consumer test environments due to TypeScript source exports:

```typescript
// vitest.config.ts
{
  find: '@weka/weka-ui-components',
  replacement: './src/test-utils/mocks/weka-ui-components.ts'
}
```

## SVG Icons

The `svgs` export is the most heavily used feature (41 files in dashboard). Icons are React components:

```tsx
import { svgs } from '@weka/weka-ui-components'
const { Arrow, AddThin, Delete, View, Hide, Monitor, Warning, Approve } = svgs

// Usage
<Arrow className={styles.icon} />
<Tooltip data="Add item"><AddThin onClick={handleAdd} /></Tooltip>
```

Common icons: `Arrow`, `AddThin`, `Delete`, `View`, `Hide`, `Monitor`, `Investigate`, `Manage`, `Configure`, `Warning`, `Approve`, severity icons (`AccidentMinor`, `AccidentMajor`, `AccidentCritical`)

## Commit Convention

Uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/):
- `feat:` - new features
- `fix:` - bug fixes
- `chore:` - maintenance tasks

## Dark Mode

Components support dark mode via `DarkModeProvider` context. Use `useDarkMode()` hook to access current theme state.

```typescript
const { isDarkMode, setTheme } = useDarkMode()
setTheme({ isDarkMode: true })
```

Consumer apps typically sync dark mode with localStorage and user preferences.

## Toast Notifications

```typescript
import { Utils } from '@weka/weka-ui-components'

// Success toast
Utils.toastSuccess('Operation completed successfully')

// Error toast (handles string, Error object, or API error response)
Utils.toastError(error)
Utils.toastError('Custom error message')

// Close dialog programmatically
Utils.closeDialog()
```

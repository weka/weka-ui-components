# weka-ui-components

Shared React/TypeScript component library for Weka products. Published as `@weka/weka-ui-components` on GitHub Packages.

## Quick Commands

```bash
yarn test:run          # Run all tests (Vitest)
yarn test              # Run tests in watch mode
yarn typecheck         # TypeScript type checking
yarn lintcheck         # ESLint check
yarn lint              # ESLint with auto-fix
yarn format            # Prettier formatting
yarn build             # Build dist (Vite)
yarn storybook         # Start Storybook on port 6006
```

## Project Structure

```
lib/
├── v2/                    # v2 components (new, CSS Modules-based)
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   ├── icons/             # SVG icon components
│   ├── styles/            # CSS variables, themes (_colors.scss, _theme.scss)
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Shared utilities and constants
│   └── index.ts           # v2 barrel export
├── ...                    # Legacy v1 components
└── main.ts                # Main entry point
dist/                      # Built output (types + JS)
plugins/                   # ESLint, Prettier, TypeScript shared configs
```

## v2 Component Structure

Every v2 component must include all of these files:

```
lib/v2/components/ComponentName/
├── ComponentName.tsx          # Component implementation
├── componentName.module.scss  # CSS Modules (camelCase filename)
├── ComponentName.test.tsx     # Vitest tests
├── ComponentName.stories.tsx  # Storybook stories
└── index.ts                   # Barrel export
```

## Code Guidelines

### String Union Types -> Const Objects

All string union types must use the **const object + `keyof typeof`** pattern. Never define plain `type Foo = 'a' | 'b'` unions.

```typescript
// Good: Single source of truth
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
} as const

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS]

// Use the const everywhere — no raw strings
variant = BUTTON_VARIANTS.PRIMARY
if (variant === BUTTON_VARIANTS.SECONDARY) { ... }

// Bad: Duplicating values
type ButtonVariant = 'primary' | 'secondary'
```

**Naming conventions:**
- Const object: UPPER_SNAKE_CASE, plural (e.g., `BUTTON_VARIANTS`, `FLEX_DIRECTIONS`, `PROTOCOL_TAG_SIZES`)
- Derived type: PascalCase, singular (e.g., `ButtonVariant`, `FlexDirection`, `ProtocolTagSize`)
- Export both the const object and the derived type from the component and barrel index

### No Repeated String Literals

When using a string literal, always:
1. **Check if a constant already exists** in `lib/v2/utils/consts.ts` or in the relevant component's const objects
2. **Create a new constant** if the string is used more than once and no constant exists yet

This applies to all strings — DOM event names (`DOM_EVENTS.KEYDOWN`), keyboard keys (`KEYBOARD_KEYS.ESCAPE`), status values, labels, etc. The only exceptions are standard JSX/HTML attributes that are inherently self-documenting (e.g., `fill='none'`, `xmlns`, `type='text/css'`).

### Constants and Derived Types

- Define string literal constants as objects with `as const` assertion
- Derive types from constants using `keyof typeof` pattern instead of manually defining union types
- Place shared constants in `lib/v2/utils/consts.ts`
- When adding a new constant that is related to existing constants, define it in the same file where related constants live

### DRY Principle (Don't Repeat Yourself)

- Avoid code duplication — extract common logic into reusable functions or hooks
- Use configuration objects instead of repetitive switch statements or conditionals
- Before writing a new helper function, check if a similar one already exists in `lib/v2/utils/` or sibling components
- If a function is used by 2+ components, it should live in a shared location (`lib/v2/utils/` or `lib/v2/hooks/`)

### TypeScript Types

- Don't create a new type if an equivalent type already exists (check `lib/v2/types/` first)
- Use utility types (`Omit`, `Pick`, `Partial`, etc.) instead of duplicating types with minor differences
- Import types from their source packages when available (e.g., `import type SimpleBarCore from 'simplebar-core'`)

### Type Guards

- Use existing type guard functions instead of inline type checks
- Check shared utils before writing inline type guards — a reusable one may already exist

### Comments

- Avoid inline comments that explain what code does — code should be self-explanatory through descriptive names
- Keep JSDoc comments on custom hooks and non-obvious constants — they provide IDE tooltips
- Remove comments that merely restate what the code already says

### Control Flow

- Avoid empty `else` blocks
- Use early returns instead of else blocks when possible

### Testing Guidelines

- Every component must have a `.test.tsx` file — tests are not optional
- Tests should be self-explanatory — avoid comments that explain what a function or method does
- Test names should clearly describe the expected behavior
- Use descriptive variable names in tests instead of relying on comments
- Structure tests with clear arrange/act/assert patterns
- Use React Testing Library — test user behavior, not implementation details

### Storybook Guidelines

- Every component must have a `.stories.tsx` file
- Include multiple story variants: Default + key states (e.g., disabled, error, loading)
- New icons must be added to `lib/v2/icons/Icons.stories.tsx` (consolidated gallery pattern)

## Development Workflow

When creating, migrating, or significantly modifying a v2 component, use the `ts-react-linter-driven-development` skills:

- **`component-designing`** — when planning new component APIs, props interfaces, and type design
- **`linter-driven-development`** — as the main workflow orchestrator (design -> test -> lint -> refactor -> review -> commit)
- **`testing`** — for test structure, patterns, and strategy decisions
- **`refactoring`** — when ESLint flags complexity issues or code needs simplification
- **`pre-commit-review`** — after linting and tests pass, to validate design quality
- **`documentation`** — for Storybook stories, JSDoc comments, and feature guides

## v2 Styles System

Components use CSS Modules with a CSS variable-based theme system:

- **Color variables:** Defined in `lib/v2/styles/_colors.scss`
- **Theme mixins:** Light/dark themes in `lib/v2/styles/_theme.scss`
- **Semantic variables:** `--text-primary`, `--bg-primary`, `--gray-300-700`, etc.
- **Theme switching:** Via `data-theme="light"` / `data-theme="dark"` attributes

When migrating a component that uses CSS variables not yet defined:
1. Add the SCSS variable to `_colors.scss` if it's a new color
2. Add the CSS variable to both `v2-light-theme` and `v2-dark-theme` mixins in `_theme.scss`

## Build and Publish

After adding new v2 components:
1. Export from `lib/v2/components/index.ts` (both component and const objects)
2. Run `yarn build` to regenerate `dist/` including `.d.ts` type declarations
3. Consumer projects resolve types from `dist/v2/index.d.ts`, not from `lib/` source

## Versioning

- `release:patch` — bug fixes
- `release:minor` — new components or features
- `release:major` — breaking changes
- `release:beta` — pre-release versions

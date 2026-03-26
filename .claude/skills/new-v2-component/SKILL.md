---
name: new-v2-component
description: Scaffold a new v2 component with all required files (tsx, scss, test, stories, index)
argument-hint: "<ComponentName>"
disable-model-invocation: true
---

Create a new v2 component: $ARGUMENTS

## Instructions

Create a complete v2 component scaffold in `lib/v2/components/` following the project conventions from CLAUDE.md.

### Steps

1. **Design the component** using the `ts-react-linter-driven-development:component-designing` skill to plan the API, props interface, and type design.

2. **Create the component folder** at `lib/v2/components/<ComponentName>/` with ALL required files:
   - `<ComponentName>.tsx` — component implementation
   - `<componentName>.module.scss` — CSS Modules styles (camelCase filename)
   - `<ComponentName>.test.tsx` — Vitest tests with React Testing Library
   - `<ComponentName>.stories.tsx` — Storybook stories (Default + key state variants)
   - `index.ts` — barrel export

3. **Follow code conventions:**
   - All string union types must use the const object + `keyof typeof` pattern (e.g., `BUTTON_VARIANTS` + `ButtonVariant`)
   - Export both const objects and derived types
   - Use CSS variables from `lib/v2/styles/` for theming
   - Use shared utilities from `lib/v2/utils/consts.ts` (e.g., `EMPTY_STRING`, `NOOP`)
   - Use relative imports (no path aliases)

4. **Register the component** in `lib/v2/components/index.ts`:
   - Add component export
   - Add type exports
   - Add const object exports (if any)

5. **Run the full workflow** using `ts-react-linter-driven-development:linter-driven-development` skill to ensure linting, tests, and type checking all pass.

6. **Validate** by running:
   ```bash
   yarn typecheck
   yarn lintcheck
   yarn test:run
   ```

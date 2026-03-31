---
name: migrate-component
description: Migrate a component from observe/frontend to weka-ui-components v2
argument-hint: "<ComponentName>"
disable-model-invocation: true
---

Migrate a component from observe/frontend to weka-ui-components v2: $ARGUMENTS

## Instructions

Migrate the specified component from `observe/frontend/src/components/` into `lib/v2/components/` following the migration plan in the observe/frontend repo (`COMPONENT_MIGRATION_PLAN.md`).

### Steps

1. **Read the source component** in the observe/frontend repo at `../gohome/observe/frontend/src/components/<ComponentName>/` (relative to the workspace root). Understand its props, dependencies, styles, and behavior.

2. **Design the v2 version** using the `ts-react-linter-driven-development:component-designing` skill. Plan any API improvements, type changes, or simplifications.

3. **Create the v2 component folder** at `lib/v2/components/<ComponentName>/` with ALL required files:
   - `<ComponentName>.tsx` — migrated component with CSS Modules, relative imports
   - `<componentName>.module.scss` — styles converted to CSS Modules (camelCase filename)
   - `<ComponentName>.test.tsx` — tests ported to Vitest + React Testing Library
   - `<ComponentName>.stories.tsx` — Storybook stories (Default + key state variants)
   - `index.ts` — barrel export

4. **Apply code transformations:**
   - Convert all string union types to const object + `keyof typeof` pattern
   - Replace path alias imports with relative imports
   - Replace `@use '../../styles' as *` with CSS variables from `lib/v2/styles/`
   - Move shared helpers to `lib/v2/utils/` if used by multiple components
   - Export both const objects and derived types

5. **Register the component** in `lib/v2/components/index.ts` — add component, type, and const exports.

6. **Run the full workflow** using `ts-react-linter-driven-development:linter-driven-development` skill.

7. **Validate** by running:
   ```bash
   yarn typecheck
   yarn lintcheck
   yarn test:run
   ```

8. **Build dist** so consumer projects can use the new component:
   ```bash
   yarn build
   ```

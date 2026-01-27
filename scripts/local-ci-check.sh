#!/bin/bash
set -e

echo "=== Local CI Check (v2 only) ==="
echo ""

echo "1/5 TypeScript check..."
yarn typecheck
echo "    TypeScript: PASSED"

echo ""
echo "2/5 ESLint check (lib/v2)..."
yarn lintcheck
echo "    ESLint: PASSED"

echo ""
echo "3/5 Stylelint check (lib/v2)..."
yarn stylecheck
echo "    Stylelint: PASSED"

echo ""
echo "4/5 Prettier check (lib/v2)..."
yarn formatcheck
echo "    Prettier: PASSED"

echo ""
echo "5/5 Running tests..."
yarn test:run
echo "    Tests: PASSED"

echo ""
echo "=== All checks passed! ==="

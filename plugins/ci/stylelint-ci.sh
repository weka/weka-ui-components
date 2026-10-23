#!/bin/bash

# Run Stylelint for CI - only fail if auto-fixable issues weren't fixed

echo "Checking Stylelint (auto-fixable rules only)..."

# Exit 2 means unfixable lint errors remain, which this check ignores; anything
# else non-zero (bad config, crash) changes no files and must not read as a pass.
status=0
npx stylelint '**/*.scss' --fix --allow-empty-input || status=$?
if [ "$status" -ne 0 ] && [ "$status" -ne 2 ]; then
  echo "❌ Stylelint failed to run (exit $status)"
  exit "$status"
fi

if git diff --quiet ':(glob)**/*.scss' 2>/dev/null; then
  echo "✓ Stylelint check passed (all auto-fixable rules are satisfied)"
  exit 0
else
  echo ""
  echo "❌ Stylelint found auto-fixable issues that weren't fixed"
  echo "Please run 'yarn stylefix' locally and commit the changes"
  echo ""
  exit 1
fi

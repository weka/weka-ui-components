#!/bin/bash

# Run ESLint for CI - only on changed files when ESLINT_PLUGIN_DIFF_COMMIT is set.
# Run from the project directory. The config is detected, not hardcoded: projects
# differ in whether they use .js or .mjs.

if [ -n "$ESLINT_PLUGIN_DIFF_COMMIT" ]; then
  CANDIDATES="eslint.diff.config.mjs eslint.diff.config.js"
  echo "Running ESLint on changed code (compared to $ESLINT_PLUGIN_DIFF_COMMIT)..."
else
  CANDIDATES="eslint.config.js eslint.config.mjs"
  echo "Running ESLint on all code..."
fi

CONFIG=""
for f in $CANDIDATES; do
  [ -f "$f" ] && CONFIG="$f" && break
done
if [ -z "$CONFIG" ]; then
  echo "::error::No ESLint config found (tried: $CANDIDATES) in $(pwd)" >&2
  exit 2
fi
echo "Using ESLint config: $CONFIG"

npx eslint . --config "$CONFIG" --ignore-pattern "tests/"

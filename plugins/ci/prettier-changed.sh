#!/bin/bash

# Run Prettier on changed files only (committed + staged + unstaged), for
# projects that still carry formatting debt elsewhere and so cannot run a
# full-tree `prettier --check`. Run from the project directory (cwd is where
# prettier and git diff are scoped).
#
# Requires BASE_REF environment variable (e.g., origin/dev).
# Optional: pass --fix to rewrite the changed files instead of only checking.
#
# Exit codes: 0 clean (or nothing changed), 1 formatting issues, 2 bad usage.

if [ -z "$BASE_REF" ]; then
  echo "ERROR: BASE_REF environment variable is required"
  echo "Usage: BASE_REF=origin/dev bash node_modules/@weka/weka-ui-components/plugins/ci/prettier-changed.sh [--fix]"
  exit 2
fi

MODE_FLAG="--check"
if [ "$1" = "--fix" ]; then
  MODE_FLAG="--write"
  echo "Running Prettier --write on changed files (compared to $BASE_REF)..."
else
  echo "Running Prettier --check on changed files (compared to $BASE_REF)..."
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
CURRENT_DIR=$(pwd)
RELATIVE_PATH=${CURRENT_DIR#$REPO_ROOT/}

# Get changed files: committed changes + staged changes + unstaged changes
COMMITTED=$(git diff --name-only --diff-filter=ACMRT "$BASE_REF"...HEAD 2>/dev/null || \
            git diff --name-only --diff-filter=ACMRT "$BASE_REF" 2>/dev/null || \
            echo "")
STAGED=$(git diff --cached --name-only --diff-filter=ACMRT 2>/dev/null || echo "")
UNSTAGED=$(git diff --name-only --diff-filter=ACMRT 2>/dev/null || echo "")
ALL_CHANGED=$(echo -e "$COMMITTED\n$STAGED\n$UNSTAGED" | sort -u)

# Keep files under the current directory, as paths relative to it. Iterate
# line-by-line so paths containing spaces survive; --ignore-unknown below skips
# file types Prettier cannot parse.
CHANGED_FILES=()
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if [[ "$file" == "$RELATIVE_PATH/"* ]]; then
    relative_file=${file#$RELATIVE_PATH/}
    if [[ "$relative_file" != *"node_modules"* ]] && [ -f "$relative_file" ]; then
      CHANGED_FILES+=("$relative_file")
    fi
  fi
done <<< "$ALL_CHANGED"

if [ "${#CHANGED_FILES[@]}" -eq 0 ]; then
  echo "✓ No files changed"
  exit 0
fi

echo "Changed files:"
printf '  %s\n' "${CHANGED_FILES[@]}"
echo ""

npx prettier "$MODE_FLAG" --ignore-unknown "${CHANGED_FILES[@]}"

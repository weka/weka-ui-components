#!/bin/bash

# Run Stylelint on changed SCSS files and report ALL errors plus warnings on
# CHANGED LINES only — the same set CI reviewdog posts (errors as a count, warnings
# inline on added lines). The "changed lines" definition is shared with ts:diff
# and CI via changed-lines.sh so local and CI agree.
#
# Requires BASE_REF environment variable (e.g. origin/dev).
# Optional: pass --fix to auto-fix issues (fixes the whole changed file).

if [ -z "$BASE_REF" ]; then
  echo "ERROR: BASE_REF environment variable is required"
  echo "Usage: BASE_REF=origin/dev bash node_modules/@weka/weka-ui-components/plugins/ci/stylelint-changed.sh [--fix]"
  exit 1
fi

# Check for --fix flag
FIX_FLAG=""
if [ "$1" = "--fix" ]; then
  FIX_FLAG="--fix"
  echo "Running Stylelint with --fix on changed files (compared to $BASE_REF)..."
else
  echo "Running Stylelint on changed files (compared to $BASE_REF)..."
fi

# Get the repo root and current directory
REPO_ROOT=$(git rev-parse --show-toplevel)
CURRENT_DIR=$(pwd)
# Empty at the repo root, where CURRENT_DIR has no "$REPO_ROOT/" prefix to strip.
PROJECT_PREFIX=""
[ "$CURRENT_DIR" != "$REPO_ROOT" ] && PROJECT_PREFIX="${CURRENT_DIR#$REPO_ROOT/}/"

CI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Shared "changed lines" definition (same one ts:diff and CI use).
# shellcheck source=changed-lines.sh
. "$CI_DIR/changed-lines.sh"

# Get changed files: committed changes + staged changes + unstaged changes
COMMITTED=$(git diff --name-only --diff-filter=ACMRT "$BASE_REF"...HEAD 2>/dev/null || \
            git diff --name-only --diff-filter=ACMRT "$BASE_REF" 2>/dev/null || \
            echo "")
STAGED=$(git diff --cached --name-only --diff-filter=ACMRT 2>/dev/null || echo "")
UNSTAGED=$(git diff --name-only --diff-filter=ACMRT 2>/dev/null || echo "")
ALL_CHANGED=$(echo -e "$COMMITTED\n$STAGED\n$UNSTAGED" | sort -u)

# Filter to SCSS files in current directory, convert to relative paths
# Line-by-line (not word-split) so paths containing spaces survive.
FILES=()
while IFS= read -r file; do
  [ -z "$file" ] && continue
  # Check if file is SCSS and in our directory
  if [[ "$file" == *.scss ]] && [[ "$file" == "$PROJECT_PREFIX"* ]]; then
    # Convert to path relative to current directory
    relative_file=${file#"$PROJECT_PREFIX"}
    if [[ "$relative_file" != *"node_modules"* ]] && [[ "$relative_file" != *"__tests__"* ]] && [ -f "$relative_file" ]; then
      FILES+=("$relative_file")
    fi
  fi
done <<< "$ALL_CHANGED"

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "✓ No SCSS files changed"
  exit 0
fi

echo "Changed SCSS files:"
printf '  %s\n' "${FILES[@]}"
echo ""

# --fix rewrites whole files; line scoping doesn't apply, so just fix and exit.
if [ -n "$FIX_FLAG" ]; then
  exec npx stylelint "${FILES[@]}" --allow-empty-input --fix
fi

JSON=$(mktemp)
ERR_LOG=$(mktemp)
CHANGED_KEYS=$(mktemp)
trap 'rm -f "$JSON" "$ERR_LOG" "$CHANGED_KEYS"' EXIT

# stylelint exits non-zero both when it finds lint errors and when it fails to
# run (bad config, crash). Keep stderr and validate the JSON so a broken
# toolchain can't masquerade as a clean "no errors" result. Stylelint 16+ prints its report to
# stderr, so it is written to a file instead of read from stdout.
npx stylelint "${FILES[@]}" --formatter json --allow-empty-input --output-file "$JSON" > /dev/null 2>"$ERR_LOG" || true

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required to parse Stylelint JSON output (install jq and retry)."
  exit 2
fi

if ! jq -e . "$JSON" >/dev/null 2>&1; then
  echo "❌ Stylelint failed to run:"
  echo ""
  cat "$ERR_LOG"
  exit 2
fi

print_changed_line_keys > "$CHANGED_KEYS"

# Flatten to "severity<TAB>repo-relative-path<TAB>line<TAB>col<TAB>rule<TAB>text",
# then keep every error and only warnings on a changed line.
FILTERED=$(jq -r --arg root "$REPO_ROOT/" '
    .[] as $f
    | ($f.source | ltrimstr($root)) as $rel
    | $f.warnings[]?
    | [ .severity, $rel, (.line|tostring), ((.column // 1)|tostring), (.rule // ""), .text ]
    | @tsv
  ' "$JSON" \
  | awk -F'\t' -v keys="$CHANGED_KEYS" '
      # Load keys explicitly: an empty keys file (deletion-only change) must not
      # make the first stdin record look like a key.
      BEGIN { while ((getline k < keys) > 0) keep[k] = 1 }
      $1=="error"                          { print; next }
      $1=="warning" && (($2 ":" $3) in keep) { print }
    ')

if [ -z "$FILTERED" ]; then
  echo "✓ No Stylelint errors, or warnings on changed lines"
  exit 0
fi

printf '%s\n' "$FILTERED" | awk -F'\t' '
  { mark = ($1=="error" ? "✖" : "⚠"); printf "  %s:%s:%s  %s  %s  (%s)\n", $2, $3, $4, mark, $6, $5 }
'

error_count=$(printf '%s\n' "$FILTERED" | awk -F'\t' '$1=="error"' | grep -c . || true)
echo ""
echo "Total: $error_count error(s) must be fixed; warnings above are on changed lines only."

# Errors fail (like CI); warnings on changed lines are advisory.
[ "$error_count" -gt 0 ] && exit 1
exit 0

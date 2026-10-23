#!/bin/bash

# Run TypeScript and report only errors on changed lines of changed .ts/.tsx
# files. tsc must compile the whole project; we filter its diagnostics to the
# lines you actually changed post-hoc, so this matches what CI reviewdog posts
# inline (-filter-mode=added). Run from the project directory (cwd is where tsc
# and git diff are scoped).
#
# Requires BASE_REF environment variable (e.g., origin/dev).
# Optional TSC_FLAGS environment variable selects the tsc invocation mode
# (default "--noEmit"; projects using project references pass "-b").

if [ -z "$BASE_REF" ]; then
  echo "ERROR: BASE_REF environment variable is required"
  echo "Usage: BASE_REF=origin/dev bash node_modules/@weka/weka-ui-components/plugins/ci/tsc-changed.sh"
  exit 1
fi

TSC_FLAGS="${TSC_FLAGS:---noEmit}"

echo "Running TypeScript on changed files (compared to $BASE_REF)..."

REPO_ROOT=$(git rev-parse --show-toplevel)
CURRENT_DIR=$(pwd)
RELATIVE_PATH=${CURRENT_DIR#$REPO_ROOT/}

CI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Shared "changed lines" definition, also used by the stylelint diff scripts and
# CI, so local and CI agree on what is reportable.
# shellcheck source=changed-lines.sh
. "$CI_DIR/changed-lines.sh"

# Get changed files: committed changes + staged changes + unstaged changes
COMMITTED=$(git diff --name-only --diff-filter=ACMRT "$BASE_REF"...HEAD 2>/dev/null || \
            git diff --name-only --diff-filter=ACMRT "$BASE_REF" 2>/dev/null || \
            echo "")
STAGED=$(git diff --cached --name-only --diff-filter=ACMRT 2>/dev/null || echo "")
UNSTAGED=$(git diff --name-only --diff-filter=ACMRT 2>/dev/null || echo "")
ALL_CHANGED=$(echo -e "$COMMITTED\n$STAGED\n$UNSTAGED" | sort -u)

# Filter to .ts/.tsx files in current directory, convert to relative paths.
# Iterate line-by-line (not word-split) so paths containing spaces/tabs survive;
# git does not quote such paths in --name-only output.
CHANGED_FILES=""
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if { [[ "$file" == *.ts ]] || [[ "$file" == *.tsx ]]; } && [[ "$file" == "$RELATIVE_PATH/"* ]]; then
    relative_file=${file#$RELATIVE_PATH/}
    if [[ "$relative_file" != *"node_modules"* ]] && [ -f "$relative_file" ]; then
      CHANGED_FILES="${CHANGED_FILES:+$CHANGED_FILES$'\n'}$relative_file"
    fi
  fi
done <<< "$ALL_CHANGED"

if [ -z "$CHANGED_FILES" ]; then
  echo "✓ No .ts/.tsx files changed"
  exit 0
fi

echo "Changed TS files:"
echo "$CHANGED_FILES" | sed 's/^/  /'
echo ""

TSC_LOG=$(mktemp)
trap 'rm -f "$TSC_LOG"' EXIT

# tsc compiles the whole project and exits non-zero on ANY error, including
# pre-existing ones in unchanged files that we intentionally ignore. So we
# capture the exit code rather than trusting it, and filter to changed files.
npx tsc $TSC_FLAGS --pretty false > "$TSC_LOG" 2>&1
TSC_EXIT=$?

# Located diagnostics anywhere in the project: "<file>(line,col): error TSxxxx:".
LOCATED_TOTAL=$(grep -cE '\([0-9]+,[0-9]+\): error TS[0-9]+: ' "$TSC_LOG" || true)
# Global diagnostics with no file location (bad config, missing deps, etc.) are
# printed as "error TSxxxx:" at the start of a line.
GLOBAL_ERRORS=$(grep -E '^error TS[0-9]+:' "$TSC_LOG" || true)

# Changed lines of the changed .ts/.tsx files, as project-relative "<file>:<line>"
# keys (the shared helper emits repo-relative paths; strip our project prefix and
# keep the same .ts/.tsx, non-node_modules filter used for CHANGED_FILES above).
CHANGED_LINE_KEYS=$(print_changed_line_keys | awk -v pfx="$RELATIVE_PATH/" '
  index($0, pfx) == 1 {
    k = substr($0, length(pfx) + 1)        # "<relative_file>:<line>"
    f = k; sub(/:[0-9]+$/, "", f)
    if (f ~ /\.tsx?$/ && f !~ /node_modules/) print k
  }
')

# Keep only diagnostics whose "<file>:<line>" is a changed line. Read the keys as
# the first awk input (whole lines, so paths with spaces survive); match tsc log
# lines in the second. `after+0` coerces "<line>,<col>): ..." to the line number.
FILTERED=$(awk '
  FNR == NR { if ($0 != "") keep[$0] = 1; next }
  match($0, /\([0-9]+,[0-9]+\): error TS[0-9]+: /) {
    file  = substr($0, 1, RSTART - 1)
    after = substr($0, RSTART + 1)
    if ((file ":" (after + 0)) in keep) print
  }
' <(printf '%s\n' "$CHANGED_LINE_KEYS") "$TSC_LOG")

# A file-less global error, or a non-zero exit with no located diagnostics at
# all, means tsc could not run correctly (bad config, missing deps, OOM, crash).
# Surface it instead of a false all-clear. Pre-existing located errors in
# unchanged files still exit non-zero but carry located diagnostics, so they
# remain ignored. Exit 2 (distinct from the exit 1 used for changed-file type
# errors below) lets callers tell "tsc broke" apart from "tsc found errors".
if [ -n "$GLOBAL_ERRORS" ] || { [ "$TSC_EXIT" -ne 0 ] && [ "$LOCATED_TOTAL" -eq 0 ]; }; then
  echo "❌ TypeScript failed to run (exit $TSC_EXIT):"
  echo ""
  cat "$TSC_LOG"
  exit 2
fi

if [ -z "$FILTERED" ]; then
  echo "✓ No TypeScript errors on changed lines"
  exit 0
fi

echo "❌ TypeScript errors on changed lines:"
echo ""
echo "$FILTERED"
echo ""
ERROR_COUNT=$(echo "$FILTERED" | wc -l | tr -d ' ')
echo "Total: $ERROR_COUNT error(s) on changed lines"
exit 1

#!/bin/bash
# Run Stylelint on changed SCSS files and emit rdjsonl WARNINGs for the
# aggregator. Fail the job on errors. The aggregator job consumes the rdjsonl
# artifact, applies the global cap, and posts inline comments + a summary.
#
# Env: BASE_REF (e.g. origin/dev), WORKING_DIR (e.g. frontend), GITHUB_WORKSPACE.
# Optional: RDJSONL_OUT (path relative to $GITHUB_WORKSPACE, default rdjsonl-stylelint.jsonl).

set -euo pipefail

: "${BASE_REF:?BASE_REF must be set (e.g. origin/dev)}"
: "${WORKING_DIR:?WORKING_DIR must be set}"
: "${GITHUB_WORKSPACE:?GITHUB_WORKSPACE must be set}"

OUT_RDJSONL="${RDJSONL_OUT:-rdjsonl-stylelint.jsonl}"

emit_outputs() {
  local total="$1" errors="$2"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    { echo "total=$total"; echo "errors=$errors"; } >> "$GITHUB_OUTPUT"
  fi
}

JSON=$(mktemp); trap 'rm -f "$JSON"' EXIT

# Resolved before the cd below, since BASH_SOURCE may be a relative path.
CI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PROJECT="$GITHUB_WORKSPACE/$WORKING_DIR"
# git diff pathspec is relative to cwd; this MUST run from the repo root.
cd "$GITHUB_WORKSPACE"

# Shared "changed lines" definition (same one ts:diff/style:diff use locally).
# shellcheck source=changed-lines.sh
. "$CI_DIR/changed-lines.sh"

mapfile -t REPO_FILES < <(
  git diff --name-only --diff-filter=ACMRT "$BASE_REF"...HEAD -- "$WORKING_DIR" 2>/dev/null \
    | grep -E '\.scss$' \
    | grep -vE 'node_modules|__tests__'
)

if [ "${#REPO_FILES[@]}" -eq 0 ]; then
  echo "No SCSS files changed."
  : > "$GITHUB_WORKSPACE/$OUT_RDJSONL"
  emit_outputs 0 0
  exit 0
fi

echo "Changed SCSS files:"
printf '  %s\n' "${REPO_FILES[@]}"

PROJECT_FILES=()
for f in "${REPO_FILES[@]}"; do
  PROJECT_FILES+=("${f#"$WORKING_DIR"/}")
done

(cd "$PROJECT" && npx stylelint "${PROJECT_FILES[@]}" --formatter json --allow-empty-input) \
  > "$JSON" 2>/dev/null || true

# Errors are counted across the whole changed files (all of them) — they fail
# the job and are surfaced as a count in the summary, never posted inline.
errors=$(jq '[.[] | .warnings[]? | select(.severity == "error")] | length' "$JSON")

# Warnings ARE posted inline, but only on changed lines (stylelint lints whole
# changed files, while reviewdog posts with -filter-mode=added). Build the
# warning rdjsonl, then keep only entries on a changed line so the count and the
# capped/posted set agree. Paths are repo-relative on both sides.
CHANGED_KEYS=$(mktemp); trap 'rm -f "$JSON" "$CHANGED_KEYS"' EXIT
print_changed_line_keys > "$CHANGED_KEYS"

jq -c --arg ws "$GITHUB_WORKSPACE/" '
  .[] as $f | $f.warnings[]?
  | select(.severity == "warning")
  | {
      message: .text,
      location: {
        path: ($f.source | sub("^"+$ws; "")),
        range: { start: { line: .line, column: (.column // 1) } }
      },
      severity: "WARNING",
      source: { name: "stylelint" },
      code: { value: (.rule // "") }
    }
' "$JSON" \
  | jq -rc '"\(.location.path):\(.location.range.start.line)\t\(.)"' \
  | awk -F'\t' 'NR==FNR{keep[$0]=1;next} ($1 in keep){print $2}' "$CHANGED_KEYS" - \
  > "$GITHUB_WORKSPACE/$OUT_RDJSONL"

total=$(wc -l < "$GITHUB_WORKSPACE/$OUT_RDJSONL" | tr -d ' ')
echo "Stylelint: $errors error(s); $total warning(s) on changed lines"

emit_outputs "$total" "$errors"

[ "$errors" -gt 0 ] && exit 1
exit 0

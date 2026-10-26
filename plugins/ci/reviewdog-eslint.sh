#!/bin/bash
# Run ESLint with the diff config and emit rdjsonl WARNINGs for the aggregator.
# Fail the job on errors so the per-job CI status reflects real ESLint failures.
# The aggregator job consumes the rdjsonl artifact, applies the global cap, and
# posts inline comments + a single PR summary.
#
# Env: BASE_REF (e.g. origin/dev), WORKING_DIR (e.g. frontend), GITHUB_WORKSPACE.
# Optional: RDJSONL_OUT (path relative to $GITHUB_WORKSPACE, default rdjsonl-eslint.jsonl).

set -euo pipefail

: "${BASE_REF:?BASE_REF must be set (e.g. origin/dev)}"
: "${WORKING_DIR:?WORKING_DIR must be set}"
: "${GITHUB_WORKSPACE:?GITHUB_WORKSPACE must be set}"

# Accept "./frontend", "frontend/" and "." (repo root) alongside "frontend".
WORKING_DIR="${WORKING_DIR#./}"
WORKING_DIR="${WORKING_DIR%/}"
[ "$WORKING_DIR" = "." ] && WORKING_DIR=""

OUT_RDJSONL="${RDJSONL_OUT:-rdjsonl-eslint.jsonl}"

JSON=$(mktemp); ERR_LOG=$(mktemp); trap 'rm -f "$JSON" "$ERR_LOG"' EXIT

PROJECT="$GITHUB_WORKSPACE${WORKING_DIR:+/$WORKING_DIR}"

# Diff against a SHA, not a revision expression. With CI set, eslint-plugin-diff
# treats the base as a branch to fetch and diffs against origin/<base>, which
# fails for a SHA, so it runs with CI unset (the diff itself is the same).
BASE_SHA=$(git -C "$GITHUB_WORKSPACE" rev-parse --verify "$BASE_REF^{commit}")

CONFIG=""
for f in eslint.diff.config.mjs eslint.diff.config.js; do
  [ -f "$PROJECT/$f" ] && CONFIG="$f" && break
done
if [ -z "$CONFIG" ]; then
  echo "::error::No eslint.diff.config.{mjs,js} found in $PROJECT" >&2
  exit 2
fi
echo "Using ESLint config: $CONFIG"

status=0
(cd "$PROJECT" && \
  env -u CI ESLINT_PLUGIN_DIFF_COMMIT="$BASE_SHA" \
    npx eslint . --config "$CONFIG" --format json --ignore-pattern "tests/") \
  > "$JSON" 2>"$ERR_LOG" || status=$?

# ESLint exits 0 (clean) or 1 (lint errors); anything else, or non-array JSON,
# means it crashed or was misconfigured. Fail loudly instead of reporting 0 findings.
if { [ "$status" -ne 0 ] && [ "$status" -ne 1 ]; } || ! jq -e 'type == "array"' "$JSON" >/dev/null 2>&1; then
  echo "::error::ESLint failed to run (exit $status)"
  cat "$ERR_LOG"
  : > "$GITHUB_WORKSPACE/$OUT_RDJSONL"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    { echo "total=0"; echo "errors=0"; } >> "$GITHUB_OUTPUT"
  fi
  exit 1
fi

errors=$(jq   '[.[].messages[] | select(.severity == 2)] | length' "$JSON")
warnings=$(jq '[.[].messages[] | select(.severity == 1)] | length' "$JSON")
# `total` is the postable count (warnings only). Errors fail the job and are
# surfaced as a count in the aggregator summary, never posted inline.
total="$warnings"
echo "ESLint: $errors error(s), $warnings warning(s)"

# errors fail the job, so list them in the log
if [ "$errors" -gt 0 ]; then
  jq -r '
    .[]
    | .filePath as $file
    | .messages[]
    | select(.severity == 2)
    | "\($file):\(.line):\(.column)  \(.ruleId)  \(.message)"
  ' "$JSON"
fi

jq -c --arg ws "$GITHUB_WORKSPACE/" '
  .[] as $f | $f.messages[]
  | select(.severity == 1)
  | {
      message: .message,
      location: {
        path: ($f.filePath | sub("^"+$ws; "")),
        range: { start: { line: .line, column: (.column // 1) } }
      },
      severity: "WARNING",
      source: { name: "eslint" },
      code: { value: (.ruleId // "") }
    }
' "$JSON" > "$GITHUB_WORKSPACE/$OUT_RDJSONL"

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  { echo "total=$total"; echo "errors=$errors"; } >> "$GITHUB_OUTPUT"
fi

[ "$errors" -gt 0 ] && exit 1
exit 0

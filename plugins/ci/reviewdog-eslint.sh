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

JSON=$(mktemp); trap 'rm -f "$JSON"' EXIT

PROJECT="$GITHUB_WORKSPACE/$WORKING_DIR"

CONFIG=""
for f in eslint.diff.config.mjs eslint.diff.config.js; do
  [ -f "$PROJECT/$f" ] && CONFIG="$f" && break
done
if [ -z "$CONFIG" ]; then
  echo "::error::No eslint.diff.config.{mjs,js} found in $PROJECT" >&2
  exit 2
fi
echo "Using ESLint config: $CONFIG"

(cd "$PROJECT" && \
  ESLINT_PLUGIN_DIFF_COMMIT="$BASE_REF" \
    npx eslint . --config "$CONFIG" --format json --ignore-pattern "tests/") \
  > "$JSON" 2>/dev/null || true

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

OUT_RDJSONL="${RDJSONL_OUT:-rdjsonl-eslint.jsonl}"
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

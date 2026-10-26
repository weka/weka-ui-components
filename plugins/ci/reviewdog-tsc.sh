#!/bin/bash
# Run the shared `tsc-changed.sh` (the same script used locally via
# `yarn ts:diff`) and emit TypeScript diagnostics for changed files as advisory
# rdjsonl entries for the aggregator. The change-detection + tsc + filtering all
# live in tsc-changed.sh; this script only converts its output to rdjsonl.
# Type errors in changed files are advisory (posted inline, never fail the job),
# but a tsc that could not run at all (tsc-changed.sh exit 2) fails the job so a
# broken toolchain can't masquerade as "no diagnostics".
#
# Env: BASE_REF (e.g. origin/dev), WORKING_DIR (e.g. frontend), GITHUB_WORKSPACE.
# Optional: RDJSONL_OUT (path relative to $GITHUB_WORKSPACE, default rdjsonl-tsc.jsonl).
#           TSC_FLAGS (passed through to tsc-changed.sh; default --noEmit there).

set -euo pipefail

: "${BASE_REF:?BASE_REF must be set (e.g. origin/dev)}"
: "${WORKING_DIR:?WORKING_DIR must be set}"
: "${GITHUB_WORKSPACE:?GITHUB_WORKSPACE must be set}"

# Accept "./frontend", "frontend/" and "." (repo root) alongside "frontend".
WORKING_DIR="${WORKING_DIR#./}"
WORKING_DIR="${WORKING_DIR%/}"
[ "$WORKING_DIR" = "." ] && WORKING_DIR=""

OUT_RDJSONL="${RDJSONL_OUT:-rdjsonl-tsc.jsonl}"

emit_outputs() {
  local total="$1"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    echo "total=$total" >> "$GITHUB_OUTPUT"
  fi
}

PROJECT="$GITHUB_WORKSPACE${WORKING_DIR:+/$WORKING_DIR}"
CI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TMPDIR_RD=$(mktemp -d)
trap 'rm -rf "$TMPDIR_RD"' EXIT
TSC_LOG="$TMPDIR_RD/tsc.log"
FILTERED="$TMPDIR_RD/filtered.txt"

echo "Running tsc-changed.sh in ${WORKING_DIR:-.} (BASE_REF=$BASE_REF)..."
# tsc-changed.sh exits 1 when it finds errors in changed files (advisory signal)
# and 2 when tsc could not run at all. Capture its exit code via PIPESTATUS so
# tee does not mask it.
set +e
(cd "$PROJECT" && BASE_REF="$BASE_REF" bash "$CI_DIR/tsc-changed.sh") 2>&1 | tee "$TSC_LOG"
tsc_status=${PIPESTATUS[0]}
set -e

# tsc could not run: its diagnostics are unreliable, so post nothing inline,
# report zero, and fail the job — otherwise TSC_TOTAL stays 0 and the PR summary
# would falsely show "All clear".
if [ "$tsc_status" -eq 2 ]; then
  : > "$GITHUB_WORKSPACE/$OUT_RDJSONL"
  emit_outputs 0
  echo "::error::TypeScript could not run (see log above); failing the check." >&2
  exit 1
fi

# tsc-changed.sh prints filtered diagnostics as `<path>(<line>,<col>): error TS<code>: <msg>`,
# already scoped to changed LINES (see tsc-changed.sh), matching reviewdog's
# -filter-mode=added. So the grep count below is the postable, inline count.
grep -E '\([0-9]+,[0-9]+\): error TS[0-9]+: ' "$TSC_LOG" > "$FILTERED" || true

total=$(wc -l < "$FILTERED" | tr -d ' ')
echo "TypeScript diagnostics on changed lines: $total"

jq -R -c --arg wd "${WORKING_DIR:+$WORKING_DIR/}" '
    capture("^(?<path>.+?)\\((?<line>\\d+),(?<col>\\d+)\\): error (?<code>TS\\d+): (?<msg>.+)$")
    | select(. != null)
    | {
        message: .msg,
        location: {
          path: ($wd + .path),
          range: {
            start: { line: (.line|tonumber), column: (.col|tonumber) },
            end:   { line: (.line|tonumber), column: (.col|tonumber) }
          }
        },
        severity: "WARNING",
        source: { name: "typescript" },
        code: { value: .code }
      }
' "$FILTERED" > "$GITHUB_WORKSPACE/$OUT_RDJSONL" || true

emit_outputs "$total"

exit 0

#!/bin/bash
# Aggregate rdjsonl from eslint/stylelint/tsc, apply a single TOTAL_CAP across
# all tools in priority order ESLint > Stylelint > TypeScript, post inline
# comments via reviewdog (one call per tool, preserving -name), and upsert a
# single PR summary comment by marker (scoped per project_title).
#
# Env (all optional unless noted):
#   TOTAL_CAP            cap across all tools, default 20
#   ESLINT_TOTAL         postable ESLint warnings (default 0)
#   ESLINT_ERRORS        ESLint errors (default 0; counted in summary, never inline)
#   STYLELINT_TOTAL      postable Stylelint warnings (default 0)
#   STYLELINT_ERRORS     Stylelint errors (default 0; counted in summary, never inline)
#   TSC_TOTAL            TypeScript diagnostics in changed files (default 0)
#   ESLINT_RESULT        upstream ESLint job result (success/failure/...; default success)
#   STYLELINT_RESULT     upstream Stylelint job result (default success)
#   TSC_RESULT           upstream TypeScript job result (default success)
#   PRETTIER_RESULT      upstream Prettier job result (default success; failure noted in summary)
#   SETUP_RESULT         upstream setup job result (default success); when it fails every check is skipped
#   PRETTIER_FIX_CMD     local command that fixes formatting, shown in the summary (default "yarn format")
#   PROJECT_TITLE        display title in heading and marker key (default "Reviewdog")
#   PR_NUMBER            required to manage the summary comment
#   RUN_URL              workflow run URL surfaced in the summary
#   GITHUB_REPOSITORY    required for gh/comment management
#   GH_TOKEN             gh auth
#   REVIEWDOG_GITHUB_API_TOKEN  reviewdog auth
#   ARTIFACTS_DIR        directory containing downloaded artifacts (default ./artifacts)
#   ARTIFACT_SUFFIX      suffix of the artifact names, e.g. "-frontend" for reviewdog-eslint-frontend (default empty)

set -euo pipefail

PROJECT_TITLE="${PROJECT_TITLE:-Reviewdog}"
PROJECT_KEY="$(printf '%s' "$PROJECT_TITLE" | tr '[:upper:] /' '[:lower:]--')"
MARKER="<!-- reviewdog-summary:$PROJECT_KEY -->"

TOTAL_CAP="${TOTAL_CAP:-20}"
ESLINT_TOTAL="${ESLINT_TOTAL:-0}"
ESLINT_ERRORS="${ESLINT_ERRORS:-0}"
STYLELINT_TOTAL="${STYLELINT_TOTAL:-0}"
STYLELINT_ERRORS="${STYLELINT_ERRORS:-0}"
TSC_TOTAL="${TSC_TOTAL:-0}"
ESLINT_RESULT="${ESLINT_RESULT:-success}"
STYLELINT_RESULT="${STYLELINT_RESULT:-success}"
TSC_RESULT="${TSC_RESULT:-success}"
PRETTIER_RESULT="${PRETTIER_RESULT:-success}"
SETUP_RESULT="${SETUP_RESULT:-success}"
PRETTIER_FIX_CMD="${PRETTIER_FIX_CMD:-yarn format}"
ARTIFACTS_DIR="${ARTIFACTS_DIR:-artifacts}"
ARTIFACT_SUFFIX="${ARTIFACT_SUFFIX:-}"

prettier_failed=0
[ "$PRETTIER_RESULT" = "success" ] || [ "$PRETTIER_RESULT" = "skipped" ] || prettier_failed=1

# Flag a job as crashed only when it did NOT succeed AND reported no counts: such
# a job likely died before writing its outputs (which then arrive as empty and
# are coerced to 0 below), so we must never report "All clear" on top of it. A
# job that failed but reported counts (e.g. ESLint errors) is a normal lint
# failure, fully described by the per-tool bullets, not a crash.
failed_jobs=""
flag_if_crashed() {  # name result count
  case "$2" in success|skipped) return 0 ;; esac
  [ "$3" -eq 0 ] || return 0
  failed_jobs+="${failed_jobs:+, }$1"
}

# Validate that every counter is a non-negative integer; fail fast otherwise.
for var in TOTAL_CAP ESLINT_TOTAL ESLINT_ERRORS STYLELINT_TOTAL STYLELINT_ERRORS TSC_TOTAL; do
  val="${!var}"
  if [[ ! "$val" =~ ^[0-9]+$ ]]; then
    echo "::error::$var must be a non-negative integer, got: '$val'" >&2
    exit 1
  fi
done

ESLINT_RDJSONL="$ARTIFACTS_DIR/reviewdog-eslint${ARTIFACT_SUFFIX}/rdjsonl-eslint.jsonl"
STYLELINT_RDJSONL="$ARTIFACTS_DIR/reviewdog-stylelint${ARTIFACT_SUFFIX}/rdjsonl-stylelint.jsonl"
TSC_RDJSONL="$ARTIFACTS_DIR/reviewdog-tsc${ARTIFACT_SUFFIX}/rdjsonl-tsc.jsonl"

count_lines() {
  local f="$1"
  if [ -s "$f" ]; then
    wc -l < "$f" | tr -d ' '
  else
    echo 0
  fi
}

# Actual rdjsonl line counts; fall back to job outputs if a file is missing.
eslint_have=$(count_lines "$ESLINT_RDJSONL")
stylelint_have=$(count_lines "$STYLELINT_RDJSONL")
tsc_have=$(count_lines "$TSC_RDJSONL")

# Use the lower of "available in rdjsonl" and "reported total" so we never try
# to head -n more lines than the file has.
min() { [ "$1" -lt "$2" ] && echo "$1" || echo "$2"; }

eslint_count=$(min "$eslint_have" "$ESLINT_TOTAL")
stylelint_count=$(min "$stylelint_have" "$STYLELINT_TOTAL")
tsc_count=$(min "$tsc_have" "$TSC_TOTAL")

remaining="$TOTAL_CAP"
keep_eslint=$(min "$eslint_count" "$remaining"); remaining=$((remaining - keep_eslint))
keep_stylelint=$(min "$stylelint_count" "$remaining"); remaining=$((remaining - keep_stylelint))
keep_tsc=$(min "$tsc_count" "$remaining"); remaining=$((remaining - keep_tsc))

# Errors fail CI but are not posted inline; include them so a PR with only
# errors (no postable warnings) is never reported as "All clear".
grand_total=$((ESLINT_TOTAL + ESLINT_ERRORS + STYLELINT_TOTAL + STYLELINT_ERRORS + TSC_TOTAL))

flag_if_crashed ESLint     "$ESLINT_RESULT"    $((ESLINT_TOTAL + ESLINT_ERRORS))
flag_if_crashed Stylelint  "$STYLELINT_RESULT" $((STYLELINT_TOTAL + STYLELINT_ERRORS))
flag_if_crashed TypeScript "$TSC_RESULT"       "$TSC_TOTAL"
# A failed setup skips every check; skipped reads as clean, so flag it explicitly.
flag_if_crashed Setup      "$SETUP_RESULT"     0

echo "Cap=$TOTAL_CAP  found: eslint=$ESLINT_TOTAL stylelint=$STYLELINT_TOTAL tsc=$TSC_TOTAL"
echo "Posting:        eslint=$keep_eslint  stylelint=$keep_stylelint  tsc=$keep_tsc"

run_reviewdog() {
  local name="$1" rdjsonl="$2" keep="$3"
  if [ "$keep" -le 0 ] || [ ! -s "$rdjsonl" ]; then
    return 0
  fi
  echo "Posting $keep $name finding(s) inline..."
  # rdjsonl is already scoped upstream (ESLint via eslint-plugin-diff; Stylelint/TypeScript via changed-lines.sh),
  # so use nofilter and post all of it — the reported count then always equals
  # what's posted, with no redundant second filter that could silently drop some.
  if ! head -n "$keep" "$rdjsonl" \
       | reviewdog -f=rdjsonl -name="$name" -reporter=github-pr-review \
                   -filter-mode=nofilter -level=warning -fail-on-error=false; then
    echo "::warning::reviewdog failed for $name (continuing)" >&2
  fi
}

# --- Summary comment management ------------------------------------------
# Post/update the summary BEFORE inline comments so it appears above them in
# the PR conversation (GitHub orders comments by creation time).

post_summary() {
  if [ -z "${PR_NUMBER:-}" ]; then
    echo "::warning::PR_NUMBER not set; skipping summary comment" >&2
    return 0
  fi
  if ! command -v gh >/dev/null 2>&1; then
    echo "::warning::gh CLI not found; skipping summary comment" >&2
    return 0
  fi
  : "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY must be set for summary comment}"

  existing_id=$(gh api --paginate \
      "repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" \
      --jq ".[] | select(.body | contains(\"$MARKER\")) | .id" \
      | head -n1)

  RUN_URL="${RUN_URL:-https://github.com/$GITHUB_REPOSITORY/actions/runs/${GITHUB_RUN_ID:-}}"

  local body warn=""
  if [ -n "$failed_jobs" ]; then
    warn="⚠️ These checks failed before reporting results, so findings may be incomplete: $failed_jobs. See the [workflow run]($RUN_URL)."$'\n\n'
  fi

  if [ "$grand_total" -le 0 ] && [ "$prettier_failed" -eq 0 ] && [ -z "$failed_jobs" ]; then
    body=$(cat <<EOF
$MARKER

### $PROJECT_TITLE review

All clear — no ESLint, Stylelint, TypeScript, or Prettier findings.

[Workflow run]($RUN_URL).
EOF
)
  else
    local content
    content="$(build_bullets)"
    [ -z "$content" ] && content="No findings were parsed from the tools that completed."

    body=$(cat <<EOF
$MARKER

### $PROJECT_TITLE review

${warn}${content}
EOF
)
  fi

  if [ -n "$existing_id" ]; then
    echo "Updating existing summary comment $existing_id."
    gh api --method PATCH "repos/$GITHUB_REPOSITORY/issues/comments/$existing_id" \
      -f body="$body" >/dev/null \
      || echo "::warning::Failed to update summary comment $existing_id" >&2
  else
    echo "Posting new summary comment."
    gh api --method POST "repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" \
      -f body="$body" >/dev/null \
      || echo "::warning::Failed to post summary comment" >&2
  fi
}

# Warnings are posted inline (up to the cap); errors fail CI and are shown as a
# count only — never inline, since they must be fixed regardless.
eslint_bullet() {
  [ "$ESLINT_TOTAL" -le 0 ] && [ "$ESLINT_ERRORS" -le 0 ] && return 0
  echo "- **ESLint** — $ESLINT_ERRORS error(s), $ESLINT_TOTAL warning(s) · $keep_eslint warning(s) posted inline"
  local hint="" remaining=$((ESLINT_TOTAL - keep_eslint))
  [ "$ESLINT_ERRORS" -gt 0 ] && hint="errors fail CI and are not posted inline"
  if [ "$remaining" -gt 0 ]; then
    [ -n "$hint" ] && hint+="; "
    hint+="$remaining more warning(s) not shown"
  fi
  [ -n "$hint" ] && echo "  $hint — run \`yarn lint:diff:fix\` locally."
}

stylelint_bullet() {
  [ "$STYLELINT_TOTAL" -le 0 ] && [ "$STYLELINT_ERRORS" -le 0 ] && return 0
  echo "- **Stylelint** — $STYLELINT_ERRORS error(s), $STYLELINT_TOTAL warning(s) · $keep_stylelint warning(s) posted inline"
  local hint="" remaining=$((STYLELINT_TOTAL - keep_stylelint))
  [ "$STYLELINT_ERRORS" -gt 0 ] && hint="errors fail CI and are not posted inline"
  if [ "$remaining" -gt 0 ]; then
    [ -n "$hint" ] && hint+="; "
    hint+="$remaining more warning(s) not shown"
  fi
  [ -n "$hint" ] && echo "  $hint — run \`yarn style:diff:fix\` locally."
}

prettier_bullet() {
  [ "$prettier_failed" -eq 0 ] && return 0
  echo "- **Prettier** — formatting check failed (not posted inline)"
  echo "  Run \`$PRETTIER_FIX_CMD\` locally to fix formatting."
}

tsc_bullet() {
  [ "$TSC_TOTAL" -le 0 ] && return 0
  echo "- **TypeScript** — $TSC_TOTAL diagnostics · $keep_tsc posted inline"
  local remaining=$((TSC_TOTAL - keep_tsc))
  if [ "$remaining" -gt 0 ]; then
    echo "  Run \`yarn ts:diff\` locally to see the remaining $remaining."
  fi
}

build_bullets() {
  local out="" part fn
  for fn in eslint_bullet stylelint_bullet tsc_bullet prettier_bullet; do
    # The helpers can end on a false `[ ... ] &&`; don't let that trip set -e.
    part="$("$fn")" || true
    [ -n "$part" ] && out+="$part"$'\n'
  done
  printf '%s' "${out%$'\n'}"
}

post_summary

run_reviewdog eslint     "$ESLINT_RDJSONL"    "$keep_eslint"     || true
run_reviewdog stylelint  "$STYLELINT_RDJSONL" "$keep_stylelint"  || true
run_reviewdog typescript "$TSC_RDJSONL"       "$keep_tsc"        || true

exit 0

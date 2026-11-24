#!/bin/bash
# Shared library (meant to be SOURCED, not executed): the single definition of
# "changed lines" used by ts:diff/tsc-changed.sh, style:diff/stylelint-changed.sh,
# and the CI reviewdog scripts. Keeping one definition is why local diff commands
# and CI (reviewdog's -filter-mode=added) agree on which findings are reportable.
#
# print_changed_line_keys emits "<repo-relative-path>:<line>" for every line ADDED
# relative to the merge base of BASE_REF and HEAD, as seen in the working tree
# (committed + staged + unstaged in ONE diff, so line numbers are never mixed
# across trees). On CI (clean tree) this equals BASE_REF...HEAD, which is what
# reviewdog also considers "added".
#
# Requires BASE_REF in the environment. Paths are git's repo-root-relative b/
# paths; callers strip their own project prefix as needed. Run inside the repo.

# A BASE_REF git cannot resolve makes every diff against it empty, which the
# callers would report as "nothing changed" and pass. Only the ref itself has to
# resolve: a shallow clone without a merge base still works through the two-dot
# fallbacks.
require_base_ref() {
  git rev-parse --verify --quiet "$BASE_REF^{commit}" >/dev/null && return 0
  echo "ERROR: BASE_REF '$BASE_REF' is not a commit git can find in this clone."
  echo "Fetch it (for a remote branch: git fetch origin <branch>) and run again."
  return 1
}

# print_changed_files lists the changed files as repo-root-relative paths:
# committed (against BASE_REF), staged, unstaged, and untracked non-ignored files
# under the current directory, which no git diff lists before they are `git add`ed.
# core.quotePath=false keeps non-ASCII names literal; git otherwise prints them
# quoted and escaped, and they would match no file on disk.
print_changed_files() {
  {
    git -c core.quotePath=false diff --name-only --diff-filter=ACMRT "$BASE_REF"...HEAD 2>/dev/null ||
      git -c core.quotePath=false diff --name-only --diff-filter=ACMRT "$BASE_REF" 2>/dev/null
    git -c core.quotePath=false diff --cached --name-only --diff-filter=ACMRT 2>/dev/null
    git -c core.quotePath=false diff --name-only --diff-filter=ACMRT 2>/dev/null
    git -c core.quotePath=false ls-files --others --exclude-standard --full-name 2>/dev/null
  } | sort -u
}

# Reads a --unified=0 git diff on stdin and prints "<path>:<line>" for each added
# line, plus $1 (default 0) lines past the end of each hunk.
added_line_keys_from_diff() {
  awk -v extra="${1:-0}" '
      # New-file header: keep everything after "+++ b/" so paths with spaces survive;
      # git appends a tab to the header when the path has spaces.
      /^\+\+\+ / { path = $0; sub(/^\+\+\+ b\//, "", path); sub(/\t$/, "", path); next }
      # Hunk header "@@ -a,b +c,d @@": $3 is "+c,d" (git omits ",d" when d==1 and
      # writes ",0" for pure deletions). Emit c .. c+d-1.
      /^@@ / {
        spec = $3; sub(/^\+/, "", spec)
        n = split(spec, f, ","); start = f[1] + 0; count = (n > 1 ? f[2] + 0 : 1)
        for (i = 0; i < count + extra; i++) print path ":" (start + i)
      }
  '
}

print_changed_line_keys() {
  local base
  base=$(git merge-base "$BASE_REF" HEAD 2>/dev/null) || base="$BASE_REF"
  git -c core.quotePath=false diff --unified=0 --diff-filter=ACMRT "$base" 2>/dev/null |
    added_line_keys_from_diff | sort -u
}

# print_untracked_line_keys [<pathspec>...] emits the same keys for every line of
# each untracked, non-ignored file under the current directory. git diff never
# lists such a file, so without this a new file that was not `git add`ed yet has
# no changed lines and its findings are dropped. The line after the last one is
# included: an error at end of file, such as an unclosed brace, is reported
# there. For the local scripts only: CI runs on a clean checkout and must keep
# matching reviewdog.
print_untracked_line_keys() {
  local root file
  root=$(git rev-parse --show-toplevel 2>/dev/null) || return 0
  git ls-files --others --exclude-standard --full-name -z -- "$@" 2>/dev/null |
    while IFS= read -r -d '' file; do
      [ -f "$root/$file" ] || continue
      # Against /dev/null the whole file is one added hunk, and git skips binaries.
      git -c core.quotePath=false -C "$root" diff --no-index --unified=0 -- /dev/null "$file" 2>/dev/null
    done | added_line_keys_from_diff 1 | sort -u
}

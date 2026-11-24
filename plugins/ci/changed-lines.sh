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

# Reads a --unified=0 git diff on stdin and prints "<path>:<line>" for each added line.
added_line_keys_from_diff() {
  awk '
      # New-file header: keep everything after "+++ b/" so paths with spaces survive;
      # git appends a tab to the header when the path has spaces.
      /^\+\+\+ / { path = $0; sub(/^\+\+\+ b\//, "", path); sub(/\t$/, "", path); next }
      # Hunk header "@@ -a,b +c,d @@": $3 is "+c,d" (git omits ",d" when d==1 and
      # writes ",0" for pure deletions). Emit c .. c+d-1.
      /^@@ / {
        spec = $3; sub(/^\+/, "", spec)
        n = split(spec, f, ","); start = f[1] + 0; count = (n > 1 ? f[2] + 0 : 1)
        for (i = 0; i < count; i++) print path ":" (start + i)
      }
  '
}

print_changed_line_keys() {
  local base
  base=$(git merge-base "$BASE_REF" HEAD 2>/dev/null) || base="$BASE_REF"
  git diff --unified=0 --diff-filter=ACMRT "$base" 2>/dev/null | added_line_keys_from_diff | sort -u
}

# print_untracked_line_keys [<pathspec>...] emits the same keys for every line of
# each untracked, non-ignored file under the current directory. git diff never
# lists such a file, so without this a new file that was not `git add`ed yet has
# no changed lines and its findings are dropped. For the local scripts only: CI
# runs on a clean checkout and must keep matching reviewdog.
print_untracked_line_keys() {
  local root file
  root=$(git rev-parse --show-toplevel 2>/dev/null) || return 0
  git ls-files --others --exclude-standard --full-name -z -- "$@" 2>/dev/null |
    while IFS= read -r -d '' file; do
      [ -f "$root/$file" ] || continue
      # Against /dev/null the whole file is one added hunk, and git skips binaries.
      git -C "$root" diff --no-index --unified=0 -- /dev/null "$file" 2>/dev/null
    done | added_line_keys_from_diff | sort -u
}

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

print_changed_line_keys() {
  local base
  base=$(git merge-base "$BASE_REF" HEAD 2>/dev/null) || base="$BASE_REF"
  git diff --unified=0 --diff-filter=ACMRT "$base" 2>/dev/null | awk '
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
  ' | sort -u
}

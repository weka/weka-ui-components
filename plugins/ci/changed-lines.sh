#!/bin/bash
# Shared library (meant to be SOURCED, not executed): the single definition of
# "changed lines" used by ts:diff/tsc-changed.sh, style:diff/stylelint-changed.sh,
# and the CI reviewdog scripts. Keeping one definition is why local diff commands
# and CI (reviewdog's -filter-mode=added) agree on which findings are reportable.
#
# print_changed_line_keys emits "<repo-relative-path>:<line>" for every line ADDED
# relative to BASE_REF across committed (BASE_REF...HEAD), staged, and unstaged
# changes — the same three diff sources the *-changed.sh scripts use to detect
# changed files. On CI (no staged/unstaged work) this reduces to BASE_REF...HEAD,
# which is what reviewdog also considers "added".
#
# Requires BASE_REF in the environment. Paths are git's repo-root-relative b/
# paths; callers strip their own project prefix as needed. Run inside the repo.

print_changed_line_keys() {
  {
    git diff --unified=0 --diff-filter=ACMRT "$BASE_REF"...HEAD 2>/dev/null \
      || git diff --unified=0 --diff-filter=ACMRT "$BASE_REF" 2>/dev/null
    git diff --unified=0 --cached --diff-filter=ACMRT 2>/dev/null
    git diff --unified=0          --diff-filter=ACMRT 2>/dev/null
  } | awk '
      # New-file header: keep everything after "+++ b/" so paths with spaces survive.
      /^\+\+\+ / { path = $0; sub(/^\+\+\+ b\//, "", path); next }
      # Hunk header "@@ -a,b +c,d @@": $3 is "+c,d" (git omits ",d" when d==1 and
      # writes ",0" for pure deletions). Emit c .. c+d-1.
      /^@@ / {
        spec = $3; sub(/^\+/, "", spec)
        n = split(spec, f, ","); start = f[1] + 0; count = (n > 1 ? f[2] + 0 : 1)
        for (i = 0; i < count; i++) print path ":" (start + i)
      }
  ' | sort -u
}

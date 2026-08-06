import type { ExpandedState } from '@tanstack/react-table'

import { useState } from 'react'

const NO_EXPANDED_GROUPS: ExpandedState = {}
const ALL_EXPANDED_GROUPS: ExpandedState = true

/**
 * Holds the expansion state of grouped rows, seeded either fully collapsed or
 * fully expanded.
 */
export function useGroupExpansion(defaultExpandedGroups: boolean) {
  const [expanded, setExpanded] = useState<ExpandedState>(
    defaultExpandedGroups ? ALL_EXPANDED_GROUPS : NO_EXPANDED_GROUPS
  )

  return { expanded, setExpanded }
}

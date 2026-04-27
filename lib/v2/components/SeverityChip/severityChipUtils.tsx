import type { ReactElement } from 'react'

import type { Severity } from '../../utils/consts'

import { SeverityChip } from './SeverityChip'

export function getSeverityChip(severity: Severity): ReactElement {
  return <SeverityChip severity={severity} />
}

export function getFilterSeverityChips(
  options: readonly string[]
): Record<string, ReactElement> {
  return options.reduce((acc: Record<string, ReactElement>, severity) => {
    acc[severity] = getSeverityChip(severity as Severity)
    return acc
  }, {})
}

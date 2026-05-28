import type { Severity } from '#v2/utils/consts'

import {
  WarningCircleIcon,
  WarningIcon,
  WarningTriangleIcon
} from '../../icons'
import {
  SEVERITY_CONFIG,
  SEVERITY_ICON_TYPES,
  type SeverityIconType
} from './severityConfig'

interface SeverityIconProps {
  severity: Severity
  size: number
}

function renderSeverityIcon(iconType: SeverityIconType, size: number) {
  switch (iconType) {
    case SEVERITY_ICON_TYPES.TRIANGLE:
      return (
        <WarningTriangleIcon
          filled
          size={size}
        />
      )
    case SEVERITY_ICON_TYPES.DIAMOND:
      return (
        <WarningIcon
          filled
          size={size}
        />
      )
    case SEVERITY_ICON_TYPES.CIRCLE:
    default:
      return (
        <WarningCircleIcon
          filled
          size={size}
        />
      )
  }
}

export function SeverityIcon({ severity, size }: Readonly<SeverityIconProps>) {
  return renderSeverityIcon(SEVERITY_CONFIG[severity].iconType, size)
}

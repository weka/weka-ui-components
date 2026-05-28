import type { Severity } from '#v2/utils/consts'

import { WarningCircleIcon } from '../../icons'
import { WarningIcon } from '../../icons'
import { WarningTriangleIcon } from '../../icons'
import {
  SEVERITY_CONFIG,
  SEVERITY_ICON_TYPES,
  type SeverityIconType
} from './severityConfig'

interface SeverityIconProps {
  severity: Severity
  size: number
}

function renderInfoIcon(size: number) {
  return (
    <svg
      fill='none'
      height={size}
      viewBox='0 0 40 40'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M38.7022 16.8596L23.1334 1.29078C22.3009 0.45831 21.1879 0 20 0C18.8121 0 17.6991 0.45831 16.8666 1.29078L1.29779 16.8596C-0.432598 18.5853 -0.432598 21.4007 1.29779 23.1311L16.8666 38.6952C17.6991 39.5277 18.8121 39.9907 20 39.9907C21.1879 39.9907 22.3009 39.5277 23.1334 38.6952L38.7022 23.1311C40.4326 21.4007 40.4326 18.5853 38.7022 16.8596ZM20.1216 34.0278C18.3959 34.0278 17.1145 32.7417 17.1145 30.857C17.1145 29.0518 18.3959 27.7283 20.1216 27.7283C21.8052 27.7283 23.0913 29.0518 23.0913 30.857C23.0913 32.7417 21.8052 34.0278 20.1216 34.0278ZM22.7686 11.7573C22.0484 16.13 21.5246 20.3858 20.9213 24.8801C20.8418 25.3619 19.2798 25.3993 19.2003 24.8801C18.597 20.3858 18.0358 16.13 17.353 11.7573C17.1145 10.2327 17.0303 9.59196 17.0303 8.87173C17.0303 7.94575 17.6336 7.26294 20.0795 7.26294C22.4459 7.26294 23.1287 7.94575 23.1287 8.87173C23.1287 9.59196 23.0071 10.2327 22.7686 11.7573Z'
        fill='black'
        fillOpacity={0.7}
      />
    </svg>
  )
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
    case SEVERITY_ICON_TYPES.INFO:
      return renderInfoIcon(size)
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

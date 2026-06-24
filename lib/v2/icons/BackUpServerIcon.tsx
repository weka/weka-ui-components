import { PARITY_STATUSES, type ParityStatus } from '#v2/utils/consts'

import {
  createGradientId,
  getGradientColors,
  type GradientColorKey
} from '../styles/gradientColors'

const DEFAULT_WIDTH = 24
const DEFAULT_HEIGHT = 50

export interface BackUpServerIconProps {
  width?: number
  height?: number
  extraClass?: string
  status?: ParityStatus
}

function getStatusConfig(status: ParityStatus): {
  gradientKey: GradientColorKey
  innerColor: string
} {
  switch (status) {
    case PARITY_STATUSES.WARNING:
      return { gradientKey: 'backupOrange', innerColor: 'var(--yellow-200)' }
    case PARITY_STATUSES.ERROR:
    case PARITY_STATUSES.CRITICAL:
      return { gradientKey: 'red', innerColor: 'var(--red-200)' }
    case PARITY_STATUSES.HEALTHY:
    default:
      return { gradientKey: 'green', innerColor: 'var(--green-200)' }
  }
}

export function BackUpServerIcon({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  extraClass,
  status = PARITY_STATUSES.HEALTHY
}: Readonly<BackUpServerIconProps>) {
  const config = getStatusConfig(status)
  const gradientColors = getGradientColors(config.gradientKey)
  const gradientId = createGradientId('backupServer', status)

  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 24 50'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId}
          x1='50%'
          x2='50%'
          y1='100%'
          y2='0%'
        >
          <stop
            offset='0%'
            stopColor={gradientColors.start}
          />
          <stop
            offset='100%'
            stopColor={gradientColors.end}
          />
        </linearGradient>
      </defs>
      <rect
        fill={`url(#${gradientId})`}
        height='50'
        rx='4'
        width='24'
      />
      <rect
        fill={config.innerColor}
        height='33'
        rx='2'
        width='6'
        x='4'
        y='4'
      />
      <circle
        cx='7'
        cy='43'
        fill={config.innerColor}
        r='3'
      />
    </svg>
  )
}

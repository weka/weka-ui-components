import type { GradientColorKey } from '../../styles/gradientColors'
import {
  createGradientId,
  getGradientColors
} from '../../styles/gradientColors'
import type { AlertIconShape } from '../AlertStatusBadge'
import { ALERT_ICON_PATHS } from '../AlertStatusBadge'

export interface GradientAlertIconProps {
  size?: number
  gradientColor?: GradientColorKey
  shape?: AlertIconShape
  id?: string
}

export function GradientAlertIcon({
  size = 40,
  gradientColor = 'gray',
  shape = 'circle',
  id = 'gradient-alert'
}: Readonly<GradientAlertIconProps>) {
  const gradientColors = getGradientColors(gradientColor)
  const gradientId = createGradientId(id, shape)

  return (
    <svg
      fill='none'
      height={size}
      viewBox='0 0 54 54'
      width={size}
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
      <path
        d={ALERT_ICON_PATHS[shape]}
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}

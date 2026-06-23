import { PARITY_STATUSES, type ParityStatus } from '#v2/utils/consts'

import {
  createGradientId,
  getGradientColors,
  type GradientColorKey
} from '../styles/gradientColors'

const DEFAULT_SIZE = 50

export interface BackUpServersIconProps {
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
      return { gradientKey: 'backupGray', innerColor: 'var(--gray-150)' }
    case PARITY_STATUSES.CRITICAL:
      return { gradientKey: 'red', innerColor: 'var(--red-200)' }
    case PARITY_STATUSES.HEALTHY:
    default:
      return { gradientKey: 'green', innerColor: 'var(--green-200)' }
  }
}

export function BackUpServersIcon({
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  extraClass,
  status = PARITY_STATUSES.HEALTHY
}: Readonly<BackUpServersIconProps>) {
  const config = getStatusConfig(status)
  const gradientColors = getGradientColors(config.gradientKey)
  const gradientId1 = createGradientId('backupServers1', status)
  const gradientId2 = createGradientId('backupServers2', status)
  const gradientId3 = createGradientId('backupServers3', status)
  const clipPathId = `clip-backupServers-${status}`

  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 50 50'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId1}
          x1='18.5067'
          x2='18.5067'
          y1='50'
          y2='0'
        >
          <stop stopColor={gradientColors.start} />
          <stop
            offset='1'
            stopColor={gradientColors.end}
          />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId2}
          x1='38.0025'
          x2='38.0025'
          y1='50'
          y2='0'
        >
          <stop stopColor={gradientColors.start} />
          <stop
            offset='1'
            stopColor={gradientColors.end}
          />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId3}
          x1='5.4989'
          x2='5.4989'
          y1='50'
          y2='0'
        >
          <stop stopColor={gradientColors.start} />
          <stop
            offset='1'
            stopColor={gradientColors.end}
          />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect
            fill='white'
            height='50'
            width='50'
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d='M20.1164 46.9C20.0464 46.61 20.0064 46.31 20.0064 46V4C20.0064 1.79 21.7961 0 24.0056 0H16.0072C13.7977 0 13.0078 1.79 13.0078 4V46C13.0078 46.31 13.0478 46.61 13.1178 46.9C13.5277 48.67 14.1076 50 16.0072 50H24.0056C22.106 50 20.5263 48.67 20.1164 46.9Z'
          fill={`url(#${gradientId1})`}
        />
        <path
          d='M46.0009 0H30.0041C27.7945 0 26.0049 1.79 26.0049 4V46C26.0049 46.31 26.0449 46.61 26.1149 46.9C26.5248 48.67 28.1045 50 30.0041 50H46.0009C48.2104 50 50.0001 48.21 50.0001 46V4C50.0001 1.79 48.2104 0 46.0009 0Z'
          fill={`url(#${gradientId2})`}
        />
        <path
          d='M29.7041 6.25C29.7041 5.15 30.6039 4.25 31.7037 4.25H33.7033C34.8031 4.25 35.7029 5.15 35.7029 6.25V35.25C35.7029 36.35 34.8031 37.25 33.7033 37.25H31.7037C30.6039 37.25 29.7041 36.35 29.7041 35.25V6.25Z'
          fill={config.innerColor}
        />
        <path
          d='M35.7029 42.75C35.7029 44.41 34.3632 45.75 32.7035 45.75C31.0438 45.75 29.7041 44.41 29.7041 42.75C29.7041 41.09 31.0438 39.75 32.7035 39.75C34.3632 39.75 35.7029 41.09 35.7029 42.75Z'
          fill={config.innerColor}
        />
        <path
          d='M7.10858 46.9C7.03859 46.61 6.9986 46.31 6.9986 46V4C6.9986 1.79 8.78824 0 10.9978 0H2.9994C0.789842 0 0 1.79 0 4V46C0 46.31 0.039992 46.61 0.109978 46.9C0.519896 48.67 1.09978 50 2.9994 50H10.9978C9.09818 50 7.5185 48.67 7.10858 46.9Z'
          fill={`url(#${gradientId3})`}
        />
      </g>
    </svg>
  )
}

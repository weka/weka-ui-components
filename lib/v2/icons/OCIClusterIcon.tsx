import { CLOUD_ICON_VARIANTS, EMPTY_STRING } from '../utils/consts'

const TRANSLATE_X_RATIO = 0.15
const TRANSLATE_Y_DEFAULT_RATIO = 0.3
const TRANSLATE_Y_HEADER_RATIO = 0.32

export interface OCIClusterIconProps {
  size?: number
  extraClass?: string
  variant?: 'default' | 'header'
}

export function OCIClusterIcon({
  size = 28,
  extraClass = EMPTY_STRING,
  variant = 'default'
}: Readonly<OCIClusterIconProps>) {
  const showBackground = variant !== CLOUD_ICON_VARIANTS.HEADER

  if (variant === CLOUD_ICON_VARIANTS.HEADER) {
    return (
      <svg
        fill='none'
        height='20'
        viewBox='0 0 20 20'
        width='20'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M6.92143 15C4.00211 15 1.66666 12.7778 1.66666 10C1.66666 7.22222 4.00211 5 6.92143 5H13.0785C15.9979 5 18.3333 7.22222 18.3333 10C18.3333 12.7778 15.9979 15 13.0785 15H6.92143ZM12.9193 13.2323C14.8301 13.2323 16.3163 11.7677 16.3163 10C16.3163 8.18182 14.7771 6.76768 12.9193 6.76768H7.08067C5.16984 6.76768 3.68364 8.23232 3.68364 10C3.68364 11.7677 5.22292 13.2323 7.08067 13.2323H12.9193Z'
          fill='#C74634'
        />
      </svg>
    )
  }

  return (
    <svg
      className={extraClass}
      fill='none'
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      {showBackground ? (
        <rect
          fill='#C74634'
          height={size}
          rx={size / 2}
          width={size}
          x='0'
          y='0'
        />
      ) : null}
      <g
        transform={`translate(${size * TRANSLATE_X_RATIO}, ${
          size *
          (showBackground
            ? TRANSLATE_Y_DEFAULT_RATIO
            : TRANSLATE_Y_HEADER_RATIO)
        })`}
      >
        <path
          d='M4.44635 8.46154C1.97616 8.46154 0 6.5812 0 4.23077C0 1.88034 1.97616 0 4.44635 0H9.65622C12.1264 0 14.1026 1.88034 14.1026 4.23077C14.1026 6.5812 12.1264 8.46154 9.65622 8.46154H4.44635ZM9.52148 6.96581C11.1383 6.96581 12.3959 5.7265 12.3959 4.23077C12.3959 2.69231 11.0934 1.49573 9.52148 1.49573H4.58109C2.96423 1.49573 1.70668 2.73504 1.70668 4.23077C1.70668 5.7265 3.00915 6.96581 4.58109 6.96581H9.52148Z'
          fill='white'
        />
      </g>
    </svg>
  )
}

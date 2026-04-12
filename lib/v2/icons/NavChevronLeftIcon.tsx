export interface NavChevronLeftIconProps {
  extraClass?: string
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
}

import { CSS_VARS } from '../utils/consts'

export function NavChevronLeftIcon({
  extraClass,
  color = CSS_VARS.GRAY_900_100,
  width = 18,
  height = 18,
  strokeWidth = 1.5
}: Readonly<NavChevronLeftIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 18 18'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M11 14L6 9L11 4'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

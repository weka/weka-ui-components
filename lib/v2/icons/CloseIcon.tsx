import { EMPTY_STRING } from '../utils/consts'

export interface CloseIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
  strokeWidth?: number
}

const DEFAULT_SIZE = 14

export function CloseIcon({
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  extraClass = EMPTY_STRING,
  strokeWidth
}: Readonly<CloseIconProps>) {
  if (strokeWidth !== undefined) {
    return (
      <svg
        className={extraClass}
        fill='none'
        height={height}
        viewBox='0 0 16 16'
        width={width}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5'
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M11.8439 2.14614C12.0319 2.31541 12.0393 2.59771 11.8605 2.77668L2.81005 11.8363C2.63127 12.0153 2.33396 12.0231 2.14599 11.8539C1.95803 11.6846 1.95058 11.4023 2.12937 11.2233L11.1798 2.16369C11.3586 1.98472 11.6559 1.97687 11.8439 2.14614Z'
        fill={color}
      />
      <path
        d='M2.18024 2.14614C2.34934 1.95798 2.63136 1.95053 2.81014 2.1295L11.8606 11.1891C12.0394 11.3681 12.0472 11.6657 11.8781 11.8539C11.709 12.042 11.427 12.0495 11.2482 11.8705L2.19777 2.81087C2.01898 2.6319 2.01114 2.3343 2.18024 2.14614Z'
        fill={color}
      />
    </svg>
  )
}

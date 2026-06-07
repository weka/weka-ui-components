import { EMPTY_STRING } from '#v2/utils/consts'

export interface CloseRoundedIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

const DEFAULT_SIZE = 12

export function CloseRoundedIcon({
  extraClass = EMPTY_STRING,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<CloseRoundedIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 12 12'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM9 8.154L8.154 9L6 6.846L3.846 9L3 8.154L5.154 6L3 3.846L3.846 3L6 5.154L8.154 3L9 3.846L6.846 6L9 8.154Z'
        fill={color}
      />
    </svg>
  )
}

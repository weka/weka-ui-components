import { EMPTY_STRING } from '#v2/utils/consts'

export interface FilterIconProps {
  width?: number
  height?: number
  extraClass?: string
  color?: string
}

const DEFAULT_SIZE = 14

export function FilterIcon({
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  extraClass = EMPTY_STRING,
  color = 'var(--gray-850-150)'
}: Readonly<FilterIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 14 14'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.5 7.5H3.5C3.15 7.5 2.875 7.225 2.875 6.875C2.875 6.525 3.15 6.25 3.5 6.25H10.5C10.85 6.25 11.125 6.525 11.125 6.875C11.125 7.225 10.85 7.5 10.5 7.5Z'
        fill={color}
      />
      <path
        d='M8.75 11H5.25C4.9 11 4.625 10.725 4.625 10.375C4.625 10.025 4.9 9.75 5.25 9.75H8.75C9.1 9.75 9.375 10.025 9.375 10.375C9.375 10.725 9.1 11 8.75 11Z'
        fill={color}
      />
      <path
        d='M12.25 4H1.75C1.4 4 1.125 3.725 1.125 3.375C1.125 3.025 1.4 2.75 1.75 2.75H12.25C12.6 2.75 12.875 3.025 12.875 3.375C12.875 3.725 12.6 4 12.25 4Z'
        fill={color}
      />
    </svg>
  )
}

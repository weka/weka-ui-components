export interface NavChevronRightIconProps {
  extraClass?: string
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
}

export function NavChevronRightIcon({
  extraClass,
  color = 'var(--gray-900-100)',
  width = 18,
  height = 18,
  strokeWidth = 1.5
}: Readonly<NavChevronRightIconProps>) {
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
        d='M7 4L12 9L7 14'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

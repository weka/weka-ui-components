const DEFAULT_SIZE = 24

export interface DashboardFillIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function DashboardFillIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<DashboardFillIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 24 24'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9.70828 2H3.45828C2.65414 2 2 2.65414 2 3.45828V7.20828C2 8.01257 2.65414 8.66672 3.45828 8.66672H9.70828C10.5126 8.66672 11.1667 8.01257 11.1667 7.20828V3.45828C11.1667 2.65414 10.5126 2 9.70828 2Z'
        fill={color}
      />
      <path
        d='M9.70828 10.3333H3.45828C2.65414 10.3333 2 10.9874 2 11.7917V20.5417C2 21.3459 2.65414 22 3.45828 22H9.70828C10.5126 22 11.1667 21.3459 11.1667 20.5417V11.7917C11.1667 10.9874 10.5126 10.3333 9.70828 10.3333Z'
        fill={color}
      />
      <path
        d='M20.5417 15.3333H14.2917C13.4874 15.3333 12.8333 15.9874 12.8333 16.7917V20.5417C12.8333 21.3459 13.4874 22 14.2917 22H20.5417C21.3459 22 22 21.3459 22 20.5417V16.7917C22 15.9874 21.3459 15.3333 20.5417 15.3333Z'
        fill={color}
      />
      <path
        d='M20.5417 2H14.2917C13.4874 2 12.8333 2.65414 12.8333 3.45828V12.2083C12.8333 13.0126 13.4874 13.6667 14.2917 13.6667H20.5417C21.3459 13.6667 22 13.0126 22 12.2083V3.45828C22 2.65414 21.3459 2 20.5417 2Z'
        fill={color}
      />
    </svg>
  )
}

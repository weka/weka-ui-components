export interface CloseWithBgIconProps {
  extraClass?: string
  width?: number
  height?: number
  color?: string
}

export function CloseWithBgIcon({
  extraClass,
  width = 10,
  height = 10,
  color = 'currentColor'
}: Readonly<CloseWithBgIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 10 10'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5 0C2.235 0 0 2.235 0 5C0 7.765 2.235 10 5 10C7.765 10 10 7.765 10 5C10 2.235 7.765 0 5 0ZM7.5 6.795L6.795 7.5L5 5.705L3.205 7.5L2.5 6.795L4.295 5L2.5 3.205L3.205 2.5L5 4.295L6.795 2.5L7.5 3.205L5.705 5L7.5 6.795Z'
        fill={color}
      />
    </svg>
  )
}

const DEFAULT_SIZE = 24

export interface DistributionFillIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function DistributionFillIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<DistributionFillIconProps>) {
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
        d='M14.25 6.17587V6.17131L17.6183 7.69778L21 6.41491L12 3L3 6.41491L12 9.82982L15.3683 8.55151L12 7.14684V7.14343L14.25 6.17587Z'
        fill={color}
      />
      <path
        d='M3 7.55322V17.798L11.4375 21V10.7553L3 7.55322ZM7.5 17.8355L5.25 16.9818V15.7672L7.5 16.6209V17.8355Z'
        fill={color}
      />
      <path
        d='M17.625 8.83381V11.6853L15.375 12.539V9.68754L12.5625 10.7553V21L21 17.798V7.55322L17.625 8.83381Z'
        fill={color}
      />
    </svg>
  )
}

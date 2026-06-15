const DEFAULT_WIDTH = 8
const DEFAULT_HEIGHT = 14

export interface ChevronLeftIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function ChevronLeftIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT
}: Readonly<ChevronLeftIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 8 14'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        clipRule='evenodd'
        d='M0.276981 6.01003C-0.0923267 6.36261 -0.092327 6.93425 0.276981 7.28683C0.341414 7.34834 0.412831 7.39913 0.488796 7.43918L6.38564 13.0689C6.75495 13.4215 7.35371 13.4215 7.72302 13.0689C8.09233 12.7163 8.09233 12.1447 7.72302 11.7921L2.30917 6.62349L7.63258 1.54123C8.00188 1.18865 8.00188 0.617012 7.63258 0.264434C7.26327 -0.0881446 6.6645 -0.0881445 6.2952 0.264434L0.276981 6.01003Z'
        fill={color}
        fillRule='evenodd'
      />
    </svg>
  )
}

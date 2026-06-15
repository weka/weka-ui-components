const DEFAULT_SIZE = 54

export interface PauseIconProps {
  extraClass?: string
  fill?: string
  width?: number
  height?: number
}

export function PauseIcon({
  extraClass,
  fill = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<PauseIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 55 54'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M27.5 4.5C15.0935 4.5 5 14.5935 5 27C5 39.4065 15.0935 49.5 27.5 49.5C39.9065 49.5 50 39.4065 50 27C50 14.5935 39.9065 4.5 27.5 4.5ZM25.25 33.75C25.25 34.9942 24.242 36 23 36C21.758 36 20.75 34.9942 20.75 33.75V20.25C20.75 19.0057 21.758 18 23 18C24.242 18 25.25 19.0057 25.25 20.25V33.75ZM34.25 33.75C34.25 34.9942 33.2442 36 32 36C30.7558 36 29.75 34.9942 29.75 33.75V20.25C29.75 19.0057 30.7558 18 32 18C33.2442 18 34.25 19.0057 34.25 20.25V33.75Z'
        fill={fill}
      />
    </svg>
  )
}

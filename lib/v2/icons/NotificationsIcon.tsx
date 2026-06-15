const DEFAULT_SIZE = 28

export interface NotificationsIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function NotificationsIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<NotificationsIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 28 28'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M23.8479 18.7765C22.2603 17.534 21.35 15.7179 21.35 13.7939V11.0833C21.35 7.66208 18.6053 4.82999 15.05 4.35555V3.30555C15.05 2.76791 14.5796 2.33333 14 2.33333C13.4204 2.33333 12.95 2.76791 12.95 3.30555V4.35555C9.39365 4.82999 6.65 7.66208 6.65 11.0833V13.7939C6.65 15.7179 5.73965 17.534 4.1426 18.7843C3.73415 19.108 3.5 19.5786 3.5 20.0764C3.5 21.0146 4.32425 21.7778 5.3375 21.7778H22.6625C23.6757 21.7778 24.5 21.0146 24.5 20.0764C24.5 19.5786 24.2658 19.108 23.8479 18.7765Z'
        fill={color}
      />
      <path
        d='M14 25.6667C15.9015 25.6667 17.4923 24.4115 17.8577 22.75H10.1423C10.5077 24.4115 12.0984 25.6667 14 25.6667Z'
        fill={color}
      />
    </svg>
  )
}

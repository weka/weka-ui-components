const DEFAULT_SIZE = 24

export interface UserFillIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function UserFillIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<UserFillIconProps>) {
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
        d='M7.11429 6.87179C7.11429 4.18564 9.30617 2 12 2C14.6938 2 16.8857 4.18564 16.8857 6.87179C16.8857 9.55795 14.6938 11.7436 12 11.7436C9.30617 11.7436 7.11429 9.55795 7.11429 6.87179ZM15.0857 13.2821H8.91429C5.65371 13.2821 3 15.9282 3 19.1795C3 20.7354 4.26823 22 5.82857 22H18.1714C19.7318 22 21 20.7354 21 19.1795C21 15.9282 18.3463 13.2821 15.0857 13.2821Z'
        fill={color}
      />
    </svg>
  )
}

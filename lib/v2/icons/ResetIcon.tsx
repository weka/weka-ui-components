import { EMPTY_STRING } from '#v2/utils/consts'

export interface ResetIconProps {
  color?: string
  width?: string | number
  height?: string | number
  extraClass?: string
}

const DEFAULT_SIZE = 22

export function ResetIcon({
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  extraClass = EMPTY_STRING
}: Readonly<ResetIconProps>) {
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
        d='M18.7286 4.5449C16.9082 3 14.5449 2 12 2C6.4551 2 2 6.4551 2 12H3.81837C3.81837 7.4551 7.4551 3.81837 12 3.81837C14.0918 3.81837 16 4.54694 17.3633 5.81837L15.8184 7.27347L21.2735 8.27347L20.4551 2.81837L18.7286 4.5449ZM5.4551 19.5449C7.27143 21.0918 9.5449 22 12 22C17.5449 22 22 17.5449 22 12H20.1816C20.1816 16.5449 16.5449 20.1816 12 20.1816C10 20.1816 8.18163 19.4531 6.81837 18.3633L8.54694 16.7265L3.09184 15.7265L3.9102 21.1816L5.4551 19.5449Z'
        fill={color}
      />
    </svg>
  )
}

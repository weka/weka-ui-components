import { EMPTY_STRING } from '#v2/utils/consts'

export interface SortIconProps {
  width?: number
  height?: number
  extraClass?: string
  color?: string
}

const DEFAULT_SIZE = 24

export function SortIcon({
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  extraClass = EMPTY_STRING,
  color = 'var(--gray-900-100)'
}: Readonly<SortIconProps>) {
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
        d='M12.7143 2.76923C12.7143 2.3444 12.3945 2 12 2C11.6055 2 11.2857 2.3444 11.2857 2.76923L11.2857 19.3737L8.21936 16.0715C7.94042 15.7711 7.48816 15.7711 7.20921 16.0715C6.93026 16.3719 6.93026 16.8589 7.20921 17.1593L11.4949 21.7747C11.7738 22.0751 12.2261 22.0751 12.5051 21.7747L16.7908 17.1593C17.0697 16.8589 17.0697 16.3718 16.7908 16.0714C16.5118 15.771 16.0596 15.771 15.7806 16.0714L12.7143 19.3737L12.7143 2.76923Z'
        fill={color}
      />
    </svg>
  )
}

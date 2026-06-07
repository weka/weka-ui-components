import { EMPTY_STRING } from '#v2/utils/consts'

export interface SortUpDownIconProps {
  width?: number
  height?: number
  extraClass?: string
  color?: string
}

const DEFAULT_SIZE = 24

export function SortUpDownIcon({
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  extraClass = EMPTY_STRING,
  color = 'var(--gray-900-100)'
}: Readonly<SortUpDownIconProps>) {
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
        clipRule='evenodd'
        d='M6.66669 3C6.8435 3 7.01307 3.07294 7.13809 3.20277L11.1381 7.3566C11.3984 7.62696 11.3984 8.06531 11.1381 8.33567C10.8777 8.60603 10.4556 8.60603 10.1953 8.33567L7.33333 5.36367L7.33333 20.3077C7.33333 20.69 7.03486 21 6.66667 21C6.29848 21 6 20.69 6 20.3077L6 5.36371L3.13807 8.33571C2.87772 8.60607 2.45561 8.60607 2.19526 8.33571C1.93491 8.06535 1.93491 7.627 2.19526 7.35664L6.19528 3.20277C6.32031 3.07294 6.48988 3 6.66669 3ZM17.3333 3C17.7015 3 18 3.30996 18 3.69231L18 18.6363L20.8619 15.6643C21.1223 15.3939 21.5444 15.3939 21.8047 15.6643C22.0651 15.9347 22.0651 16.373 21.8047 16.6434L17.8047 20.7972C17.5444 21.0676 17.1223 21.0676 16.8619 20.7972L12.8619 16.6434C12.6016 16.373 12.6016 15.9347 12.8619 15.6643C13.1223 15.394 13.5444 15.394 13.8047 15.6643L16.6667 18.6363L16.6667 3.69231C16.6667 3.30996 16.9651 3 17.3333 3Z'
        fill={color}
        fillRule='evenodd'
      />
    </svg>
  )
}

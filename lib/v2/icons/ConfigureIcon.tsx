const DEFAULT_SIZE = 24

export interface ConfigureIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function ConfigureIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<ConfigureIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 20 20'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17.8 8.3C17.6 7.4 17.2 6.5 16.7 5.7L17.7 3.6L16.3 2.2L14.2 3.2C13.4 2.7 12.6 2.4 11.7 2.2L11 0H9L8.2 2.2C7.3 2.4 6.5 2.8 5.7 3.3L3.6 2.3L2.2 3.6L3.2 5.7C2.7 6.5 2.4 7.3 2.2 8.2L0 9V11L2.2 11.8C2.4 12.7 2.8 13.6 3.2 14.3L2.2 16.4L3.6 17.8L5.7 16.8C6.5 17.3 7.3 17.7 8.2 17.9L9 20H11L11.8 17.8C12.1 17.7 12.5 17.6 12.8 17.5L11.2 15.9C7.4 16.6 4 13.8 4 10C4 6.7 6.7 4 10 4C13.7 4 16.5 7.3 15.9 10.8L17.6 12.5C17.7 12.2 17.8 12 17.8 11.7L20 11V9L17.8 8.3Z'
        fill={color}
      />
      <path
        d='M19.6 17.4L13.7 11.5C15.1 8.4 12.2 5.1 9 6L10.8 7.8C11.6 8.6 11.6 9.9 10.8 10.6C10.1 11.4 8.7 11.4 8 10.6L6.2 8.9C5.3 11.7 8.2 14.9 11.5 13.6L17.4 19.5C18 20.1 18.9 20.1 19.5 19.5C20.1 19 20.1 18 19.6 17.4Z'
        fill={color}
      />
    </svg>
  )
}


export interface CheckboxPartialIconProps {
  color?: string
  width?: string | number
  height?: string | number
  extraClass?: string
}

export function CheckboxPartialIcon({
  color = 'currentColor',
  width = 18,
  height = 18,
  extraClass
}: Readonly<CheckboxPartialIconProps>) {
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
        d='M16.76 2H7.24C4.36 2 2 4.36 2 7.24V16.76C2 19.64 4.36 22 7.24 22H16.76C19.64 22 22 19.64 22 16.76V7.24C22 4.36 19.64 2 16.76 2ZM18.44 12.24C18.44 12.96 17.85 13.55 17.13 13.55H6.87C6.15 13.55 5.56 12.96 5.56 12.24V11.76C5.56 11.04 6.15 10.45 6.87 10.45H17.12C17.84 10.45 18.43 11.04 18.43 11.76V12.24H18.44Z'
        fill={color}
      />
    </svg>
  )
}

export default CheckboxPartialIcon

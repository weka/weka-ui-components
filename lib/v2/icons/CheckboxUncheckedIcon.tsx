export interface CheckboxUncheckedIconProps {
  color?: string
  width?: string | number
  height?: string | number
  extraClass?: string
}

export function CheckboxUncheckedIcon({
  color = 'currentColor',
  width = 18,
  height = 18,
  extraClass
}: Readonly<CheckboxUncheckedIconProps>) {
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
        d='M17 20V22H7V20H17ZM20 17V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20V22C4.23858 22 2 19.7614 2 17V7C2 4.32472 4.10111 2.14053 6.74316 2.00684L7 2H17L17.2568 2.00684C19.8989 2.14053 22 4.32472 22 7V17L21.9932 17.2568C21.8595 19.8989 19.6753 22 17 22V20C18.6569 20 20 18.6569 20 17Z'
        fill={color}
      />
    </svg>
  )
}

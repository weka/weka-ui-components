import type { SVGProps } from 'react'

export interface ChartIconProps extends SVGProps<SVGSVGElement> {
  color?: string
  extraClass?: string
}

export function ChartIcon({
  color = 'currentColor',
  extraClass,
  ...props
}: Readonly<ChartIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height='30'
      viewBox='0 0 30 30'
      width='30'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M30 28.5C30 29.325 29.325 30 28.5 30H1.5C0.675 30 0 29.325 0 28.5C0 27.675 0.675 27 1.5 27H28.5C29.325 27 30 27.675 30 28.5ZM24 24C24.825 24 25.5 23.325 25.5 22.5V1.5C25.5 0.675 24.825 0 24 0C23.175 0 22.5 0.675 22.5 1.5V22.5C22.5 23.325 23.175 24 24 24ZM6 24C6.825 24 7.5 23.325 7.5 22.5V16.5C7.5 15.675 6.825 15 6 15C5.175 15 4.5 15.675 4.5 16.5V22.5C4.5 23.325 5.175 24 6 24ZM18 24C18.825 24 19.5 23.325 19.5 22.5V10.5C19.5 9.675 18.825 9 18 9C17.175 9 16.5 9.675 16.5 10.5V22.5C16.5 23.325 17.175 24 18 24ZM12 24C12.825 24 13.5 23.325 13.5 22.5V4.5C13.5 3.675 12.825 3 12 3C11.175 3 10.5 3.675 10.5 4.5V22.5C10.5 23.325 11.175 24 12 24Z'
        fill={color}
      />
    </svg>
  )
}

export default ChartIcon

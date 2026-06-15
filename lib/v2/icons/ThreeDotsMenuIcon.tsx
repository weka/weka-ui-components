const DEFAULT_SIZE = 12

export interface ThreeDotsMenuIconProps {
  extraClass?: string
  color?: string
  size?: number
}

export function ThreeDotsMenuIcon({
  extraClass,
  color = 'currentColor',
  size = DEFAULT_SIZE
}: Readonly<ThreeDotsMenuIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={size}
      viewBox='0 0 4 12'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M3.20005 1.79998C3.20005 2.46272 2.66279 2.99998 2.00005 2.99998C1.33731 2.99998 0.800049 2.46272 0.800049 1.79998C0.800049 1.13723 1.33731 0.599976 2.00005 0.599976C2.66279 0.599976 3.20005 1.13723 3.20005 1.79998Z'
        fill={color}
      />
      <path
        d='M3.20005 5.99998C3.20005 6.66272 2.66279 7.19998 2.00005 7.19998C1.33731 7.19998 0.800049 6.66272 0.800049 5.99998C0.800049 5.33723 1.33731 4.79998 2.00005 4.79998C2.66279 4.79998 3.20005 5.33723 3.20005 5.99998Z'
        fill={color}
      />
      <path
        d='M3.20005 10.2C3.20005 10.8627 2.66279 11.4 2.00005 11.4C1.33731 11.4 0.800049 10.8627 0.800049 10.2C0.800049 9.53723 1.33731 8.99998 2.00005 8.99998C2.66279 8.99998 3.20005 9.53723 3.20005 10.2Z'
        fill={color}
      />
    </svg>
  )
}

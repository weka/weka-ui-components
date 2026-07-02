export interface EyeOffIconProps {
  extraClass?: string
  size?: number
  color?: string
}

export function EyeOffIcon({
  extraClass,
  size = 16,
  color = 'currentColor'
}: Readonly<EyeOffIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={size}
      viewBox='0 0 18 18'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9 3C5 3 2.73 5.11 1 8.5C2.73 11.89 5 14 9 14C13 14 15.27 11.89 17 8.5C15.27 5.11 13 3 9 3ZM9 12.5C7.07 12.5 5.5 10.93 5.5 9C5.5 7.07 7.07 5.5 9 5.5C10.93 5.5 12.5 7.07 12.5 9C12.5 10.93 10.93 12.5 9 12.5ZM9 7C7.9 7 7 7.9 7 9C7 10.1 7.9 11 9 11C10.1 11 11 10.1 11 9C11 7.9 10.1 7 9 7Z'
        fill={color}
      />
      <path
        d='M2.5 2.5L15.5 15.5'
        stroke={color}
        strokeLinecap='round'
        strokeWidth='1.5'
      />
    </svg>
  )
}

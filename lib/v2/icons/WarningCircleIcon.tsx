export interface WarningCircleIconProps {
  size?: number
  color?: string
  extraClass?: string
  filled?: boolean
}

export function WarningCircleIcon({
  size = 16,
  color = 'currentColor',
  extraClass,
  filled = false
}: Readonly<WarningCircleIconProps>) {
  const outlineCirclePath = (
    <path
      d='M13.6004 8C13.6004 4.9072 11.093 2.39973 8.00016 2.39973C4.90737 2.39973 2.3999 4.9072 2.3999 8C2.3999 11.0928 4.90737 13.6003 8.00016 13.6003V14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8C1.3335 4.3181 4.31826 1.33333 8.00016 1.33333C11.6821 1.33333 14.6668 4.3181 14.6668 8C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667V13.6003C11.093 13.6003 13.6004 11.0928 13.6004 8Z'
      fill={color}
    />
  )

  const filledCirclePath = (
    <circle
      cx='8'
      cy='8'
      fill={color}
      r='6.6667'
    />
  )

  return (
    <svg
      className={extraClass}
      fill='none'
      height={size}
      viewBox='0 0 16 16'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      {filled ? filledCirclePath : outlineCirclePath}
      <path
        d='M8.00017 11.3333C8.29472 11.3333 8.5335 11.068 8.5335 10.7407C8.5335 10.4135 8.29472 10.1481 8.00017 10.1481C7.70562 10.1481 7.46683 10.4135 7.46683 10.7407C7.46683 11.068 7.70562 11.3333 8.00017 11.3333Z'
        fill={filled ? 'var(--gray-0-1000)' : color}
      />
      <path
        clipRule='evenodd'
        d='M7.3335 5.4074L7.60016 8.96296C7.60016 9.20829 7.77936 9.4074 8.00016 9.4074C8.22096 9.4074 8.40016 9.20829 8.40016 8.96296L8.66683 5.4074C8.66683 5.16207 8.5335 4.66666 8.00016 4.66666C7.46683 4.66666 7.3335 5.16207 7.3335 5.4074Z'
        fill={filled ? 'var(--gray-0-1000)' : color}
        fillRule='evenodd'
      />
    </svg>
  )
}

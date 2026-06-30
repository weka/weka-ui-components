export interface CheckIconProps {
  width?: number
  height?: number
  color?: string
}

const DEFAULT_WIDTH = 12
const DEFAULT_HEIGHT = 9

export function CheckIcon({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = 'currentColor'
}: Readonly<CheckIconProps>) {
  return (
    <svg
      fill='none'
      height={height}
      viewBox='0 0 12 9'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M4.46739 8.58143C4.35602 8.68963 4.20408 8.75 4.04625 8.75C3.88842 8.75 3.73647 8.68963 3.62511 8.58143L0.26178 5.3323C-0.08726 4.99517 -0.08726 4.44848 0.26178 4.11198L0.682919 3.7051C1.03207 3.36797 1.5974 3.36797 1.94644 3.7051L4.04625 5.73339L9.72022 0.252851C10.0694 -0.0842835 10.6353 -0.0842835 10.9837 0.252851L11.4049 0.659729C11.7539 0.996863 11.7539 1.54344 11.4049 1.88005L4.46739 8.58143Z'
        fill={color}
      />
    </svg>
  )
}

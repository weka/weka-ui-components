export const ARROW_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down'
} as const

export type ArrowDirection =
  (typeof ARROW_DIRECTIONS)[keyof typeof ARROW_DIRECTIONS]

export interface ArrowIconProps {
  direction?: ArrowDirection
  extraClass?: string
  size?: number
}

const ROTATION_MAP: Record<ArrowDirection, string> = {
  [ARROW_DIRECTIONS.UP]: '-90deg',
  [ARROW_DIRECTIONS.ASC]: '-90deg',
  [ARROW_DIRECTIONS.DOWN]: '90deg',
  [ARROW_DIRECTIONS.DESC]: '90deg',
  [ARROW_DIRECTIONS.RIGHT]: '180deg',
  [ARROW_DIRECTIONS.LEFT]: '0deg'
}

export function ArrowIcon({
  direction = ARROW_DIRECTIONS.ASC,
  extraClass,
  size = 20
}: Readonly<ArrowIconProps>) {
  const rotation = ROTATION_MAP[direction] ?? '0deg'

  return (
    <svg
      className={extraClass}
      fill='none'
      height={size}
      style={{ transform: `rotate(${rotation})` }}
      viewBox='0 0 28 28'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        clipRule='evenodd'
        d='M9.34623 13.1792C8.88459 13.6199 8.88459 14.3345 9.34623 14.7752C9.42677 14.8521 9.51604 14.9156 9.611 14.9656L16.982 22.0028C17.4437 22.4435 18.1921 22.4435 18.6538 22.0028C19.1154 21.5621 19.1154 20.8475 18.6538 20.4068L11.8865 13.946L18.5407 7.59321C19.0024 7.15249 19.0024 6.43794 18.5407 5.99721C18.0791 5.55649 17.3306 5.55649 16.869 5.99721L9.34623 13.1792Z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </svg>
  )
}

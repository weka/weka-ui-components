const DEFAULT_SIZE = 24

export interface ChevronDownSmallIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function ChevronDownSmallIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<ChevronDownSmallIconProps>) {
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
        d='M17.7823 10.3173C18.0726 10.016 18.0726 9.52737 17.7823 9.22602C17.492 8.92466 17.0213 8.92466 16.731 9.22602L11.9999 14.1371L7.26903 9.22613C6.97872 8.92478 6.50804 8.92478 6.21773 9.22613C5.92742 9.52749 5.92742 10.0161 6.21773 10.3174L11.4742 15.774C11.709 16.0177 12.0617 16.0643 12.3417 15.9138C12.4079 15.8782 12.4702 15.8316 12.5258 15.7739L17.7823 10.3173Z'
        fill={color}
      />
    </svg>
  )
}

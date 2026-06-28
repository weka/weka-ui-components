import { useId } from 'react'

const DEFAULT_SIZE = 17

export interface VcheckGradientIconProps {
  extraClass?: string
  width?: number
  height?: number
}

export function VcheckGradientIcon({
  extraClass,
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<VcheckGradientIconProps>) {
  const gradientId = useId()

  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 17 17'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M8.33333 0C3.73851 0 0 3.73851 0 8.33333C0 12.9282 3.73851 16.6667 8.33333 16.6667C12.9282 16.6667 16.6667 12.9282 16.6667 8.33333C16.6667 3.73851 12.9282 0 8.33333 0ZM12.9908 6.14035L7.665 11.4244C7.35171 11.7377 6.85046 11.7586 6.51629 11.4453L3.69674 8.87636C3.36257 8.56308 3.34169 8.04094 3.63409 7.70677C3.94737 7.3726 4.46951 7.35171 4.80368 7.665L7.03843 9.71178L11.8003 4.94987C12.1345 4.61571 12.6566 4.61571 12.9908 4.94987C13.325 5.28404 13.325 5.80618 12.9908 6.14035Z'
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId}
          x1='8.33333'
          x2='8.33333'
          y1='16.6667'
          y2='0'
        >
          <stop stopColor='#268033' />
          <stop
            offset='1'
            stopColor='#59B367'
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

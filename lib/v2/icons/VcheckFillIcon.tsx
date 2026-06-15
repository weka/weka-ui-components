const DEFAULT_SIZE = 54
const DEFAULT_FILL = '#3D994B'

export interface VcheckFillIconProps {
  extraClass?: string
  fill?: string
  width?: number
  height?: number
}

export function VcheckFillIcon({
  extraClass,
  fill = DEFAULT_FILL,
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<VcheckFillIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 54 54'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M27 4.5C14.594 4.5 4.5 14.594 4.5 27C4.5 39.406 14.594 49.5 27 49.5C39.406 49.5 49.5 39.406 49.5 27C49.5 14.594 39.406 4.5 27 4.5ZM39.5752 21.0789L25.1955 35.3459C24.3496 36.1917 22.9962 36.2481 22.094 35.4023L14.4812 28.4662C13.5789 27.6203 13.5226 26.2105 14.312 25.3083C15.1579 24.406 16.5677 24.3496 17.4699 25.1955L23.5038 30.7218L36.3609 17.8647C37.2632 16.9624 38.6729 16.9624 39.5752 17.8647C40.4774 18.7669 40.4774 20.1767 39.5752 21.0789Z'
        fill={fill}
      />
    </svg>
  )
}

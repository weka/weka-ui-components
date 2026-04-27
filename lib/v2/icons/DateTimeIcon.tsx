export interface DateTimeIconProps {
  width?: number
  height?: number
  color?: string
  extraClass?: string
}

export function DateTimeIcon({
  width = 24,
  height = 24,
  color = 'currentColor',
  extraClass
}: Readonly<DateTimeIconProps>) {
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
        clipRule='evenodd'
        d='M8.5 2C8.77614 2 9 2.22386 9 2.5V4.5C9 4.77614 8.77614 5 8.5 5C8.22386 5 8 4.77614 8 4.5V2.5C8 2.22386 8.22386 2 8.5 2Z'
        fill={color}
        fillRule='evenodd'
      />
      <path
        clipRule='evenodd'
        d='M14.5 2C14.7761 2 15 2.22386 15 2.5V4.5C15 4.77614 14.7761 5 14.5 5C14.2239 5 14 4.77614 14 4.5V2.5C14 2.22386 14.2239 2 14.5 2Z'
        fill={color}
        fillRule='evenodd'
      />
      <path
        clipRule='evenodd'
        d='M20 8H3V7H20V8Z'
        fill={color}
        fillRule='evenodd'
      />
      <path
        clipRule='evenodd'
        d='M11 16C11 18.7614 13.2386 21 16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16ZM16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10Z'
        fill={color}
        fillRule='evenodd'
      />
      <path
        clipRule='evenodd'
        d='M16 12.5C16.2761 12.5 16.5 12.7239 16.5 13V16.4729L18.265 17.576C18.4992 17.7224 18.5704 18.0308 18.424 18.265C18.2776 18.4992 17.9692 18.5704 17.735 18.424L15.876 17.2621C15.6421 17.1159 15.5 16.8596 15.5 16.5837V13C15.5 12.7239 15.7239 12.5 16 12.5Z'
        fill={color}
        fillRule='evenodd'
      />
      <path
        clipRule='evenodd'
        d='M5 4.00038H18C19.1046 4.00038 20 4.89581 20 6.00038V10H21V6.00038C21 4.34352 19.6569 3.00038 18 3.00038H5C3.34315 3.00038 2 4.34352 2 6.00038V19C2 20.6569 3.34315 22 5 22H10V21H5C3.89543 21 3 20.1046 3 19V6.00038C3 4.89581 3.89543 4.00038 5 4.00038Z'
        fill={color}
        fillRule='evenodd'
      />
    </svg>
  )
}

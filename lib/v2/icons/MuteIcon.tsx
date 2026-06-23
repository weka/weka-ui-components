const DEFAULT_SIZE = 16

export interface MuteIconProps {
  extraClass?: string
  color?: string
  width?: number
  height?: number
}

export function MuteIcon({
  extraClass,
  color = 'currentColor',
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE
}: Readonly<MuteIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height={height}
      viewBox='0 0 16 16'
      width={width}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15.7654 14.6344L1.36577 0.234597C1.05297 -0.078199 0.547386 -0.078199 0.234594 0.234597C-0.078198 0.547393 -0.078198 1.05299 0.234594 1.36578L3.45611 4.58734C3.29692 4.85854 3.20012 5.20333 3.20012 5.60013V10.4001C3.20012 11.2825 3.9177 12 4.80008 12H7.66881L11.4343 15.7656C11.5871 15.9184 11.7919 16 11.9999 16C12.1031 16 12.2071 15.9808 12.3063 15.9392C12.6055 15.816 12.7999 15.5232 12.7999 15.2V13.9312L14.6342 15.7656C14.7902 15.9216 14.995 16 15.1998 16C15.4046 16 15.6094 15.9216 15.7654 15.7656C16.0782 15.4528 16.0782 14.9472 15.7654 14.6344Z'
        fill={color}
      />
      <path
        d='M12.7999 0.80019V9.60008L7.20002 4.00015H7.67201L11.4319 0.232197C11.6639 0.00819983 12.0079 -0.0637993 12.3039 0.0641991C12.6079 0.184198 12.7999 0.480194 12.7999 0.80019Z'
        fill={color}
      />
    </svg>
  )
}

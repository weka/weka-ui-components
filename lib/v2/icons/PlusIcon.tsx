export interface PlusIconProps {
  extraClass?: string
}

export function PlusIcon({ extraClass }: Readonly<PlusIconProps>) {
  return (
    <svg
      className={extraClass}
      fill='none'
      height='20'
      viewBox='0 0 20 20'
      width='20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10 2V18'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M2 10H18'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  )
}

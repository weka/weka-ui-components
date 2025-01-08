import React, { ReactElement, forwardRef } from 'react'
import Tooltip from '../Tooltip'
import { Info as InfoSvg } from 'svgs'
import clsx from 'clsx'

import './info.scss'

export interface InfoProps {
  data: ReactElement | string
  extraClass?: string
}

const InfoSvgWrapper = forwardRef<HTMLSpanElement, { className?: string }>(
  ({ className, ...props }, ref) => (
    <span ref={ref} {...props} className={clsx('component-info', className)}>
      <InfoSvg />
    </span>
  )
)
InfoSvgWrapper.displayName = 'InfoSvgWrapper'

function Info({ data, extraClass }: InfoProps) {
  return (
    <Tooltip data={data}>
      <InfoSvgWrapper className={extraClass} />
    </Tooltip>
  )
}

export default Info

import React, { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import Tooltip from '../Tooltip'
import type { TooltipProps } from '../Tooltip'
import { EMPTY_STRING } from '../../consts'
import Utils from '../../utils'

import './spanTooltip.scss'

export type SpanTooltipProps = {
  children: number | string
  extraClasses?: string
  style?: object
  additionalData?: string
  isMultiLine?: boolean
} & Omit<TooltipProps, 'children' | 'data'>

function SpanTooltip({
  children = EMPTY_STRING,
  extraClasses = EMPTY_STRING,
  style = {},
  additionalData = EMPTY_STRING,
  isMultiLine = false,
  ...tooltipProps
}: SpanTooltipProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [tooltip, setTooltip] = useState<string | number>(EMPTY_STRING)

  useEffect(() => {
    const compareSize = () => {
      if (ref.current && Utils.isEllipsisActive(ref.current, isMultiLine)) {
        setTooltip(children)
      } else {
        setTooltip(EMPTY_STRING)
      }
    }
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [children])

  const data = useMemo(() => {
    if (tooltip && additionalData) {
      return `${tooltip.toString()}\n\n${additionalData}`
    }
    return tooltip?.toString() || additionalData || EMPTY_STRING
  }, [additionalData, tooltip])

  return (
    <Tooltip data={data} {...tooltipProps}>
      <span
        className={clsx(extraClasses, 'span-tooltip')}
        ref={ref}
        style={style}
      >
        {children}
      </span>
    </Tooltip>
  )
}
export default SpanTooltip

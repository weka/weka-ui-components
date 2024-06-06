import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Tooltip from '../Tooltip'
import type { TooltipProps } from '../Tooltip'
import { EMPTY_STRING } from '../../consts'
import Utils from '../../utils'

import './spanTooltip.scss'

type SpanTooltipProps = {
  children: number | string
  extraClasses?: string
  style?: object
} & Omit<TooltipProps, 'children' | 'data'>

function SpanTooltip({
  children = EMPTY_STRING,
  extraClasses = EMPTY_STRING,
  style = {},
  ...tooltipProps
}: SpanTooltipProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [tooltip, setTooltip] = useState<string | number>(EMPTY_STRING)

  useEffect(() => {
    const compareSize = () => {
      if (ref.current && Utils.isEllipsisActive(ref.current)) {
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
  const classes = clsx({
    [extraClasses]: true,
    'span-tooltip': true
  })
  return (
    <Tooltip data={tooltip?.toString()} {...tooltipProps}>
      <span className={classes} ref={ref} style={style}>
        {children}
      </span>
    </Tooltip>
  )
}
export default SpanTooltip

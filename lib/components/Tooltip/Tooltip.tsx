import React, { ReactElement } from 'react'
import { Tooltip as MuiTooltip } from '@mui/material'
import type { TooltipProps as MuiTooltipProps } from '@mui/material'
import clsx from 'clsx'
import { EMPTY_STRING } from '../../consts'

import './tooltip.scss'

export type TooltipProps = {
  children: ReactElement
  clear?: boolean
  data?: ReactElement | string
  extraClass?: string
  extraPopperClass?: string
} & Pick<MuiTooltipProps, 'open' | 'onClose' | 'onOpen'>

function Tooltip({
  children,
  clear = false,
  data = EMPTY_STRING,
  extraClass = EMPTY_STRING,
  extraPopperClass,
  ...rest
}: TooltipProps) {
  const classes = clsx({
    'tooltip-wrapper': true,
    'clear-tooltip': clear,
    [extraClass]: true
  })
  return (
    <MuiTooltip
      enterNextDelay={400}
      enterDelay={400}
      title={data}
      classes={{
        tooltip: classes,
        arrow: 'tooltip-arrow',
        popper: extraPopperClass
      }}
      placement='top'
      arrow
      {...rest}
    >
      {children}
    </MuiTooltip>
  )
}
export default Tooltip

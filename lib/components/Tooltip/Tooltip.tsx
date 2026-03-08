import type { ForwardedRef, ReactElement } from 'react'
import React from 'react'
import type { TooltipProps as MuiTooltipProps } from '@mui/material'
import { Tooltip as MuiTooltip } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'

import Markdown from '../Markdown'

import './tooltip.scss'

export type TooltipProps = {
  children: ReactElement
  clear?: boolean
  data?: ReactElement | string
  extraClass?: string
  extraPopperClass?: string
  enterDelay?: number
  followCursor?: boolean
} & Pick<MuiTooltipProps, 'open' | 'onClose' | 'onOpen' | 'placement'>

function Tooltip({
  children,
  clear = false,
  data = EMPTY_STRING,
  extraClass = EMPTY_STRING,
  extraPopperClass = EMPTY_STRING,
  enterDelay = 400,
  followCursor = false,
  ...rest
}: TooltipProps) {
  const classes = clsx({
    'tooltip-wrapper': true,
    'clear-tooltip': clear,
    [extraClass]: true
  })

  if (!data) {
    return children
  }

  const TooltipContent = React.forwardRef(function TooltipContent(
    props,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    return (
      <div
        {...props}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {typeof data === 'string' ? <Markdown>{data}</Markdown> : data}
      </div>
    )
  })

  TooltipContent.displayName = 'TooltipContent'

  return (
    <MuiTooltip
      enterDelay={enterDelay}
      enterNextDelay={400}
      followCursor={followCursor}
      placement='top'
      title={<TooltipContent />}
      classes={{
        tooltip: classes,
        arrow: 'tooltip-arrow',
        popper: extraPopperClass
      }}
      arrow
      // when "title" prop is jsx, but not string, the component can't automatically set aria-label
      // so we need to set it manually
      {...(typeof data === 'string' && { 'aria-label': data })}
      {...rest}
    >
      {children}
    </MuiTooltip>
  )
}

export default Tooltip

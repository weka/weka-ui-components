import React, { ReactElement } from 'react'
import { Tooltip as MuiTooltip } from '@mui/material'
import type { TooltipProps as MuiTooltipProps } from '@mui/material'
import clsx from 'clsx'
import { EMPTY_STRING } from 'consts'
import Markdown from 'react-markdown'

import './tooltip.scss'

export type TooltipProps = {
  children: ReactElement
  clear?: boolean
  data?: ReactElement | string
  extraClass?: string
  extraPopperClass?: string
  enterDelay?: number
  followCursor?: boolean
} & Pick<MuiTooltipProps, 'open' | 'onClose' | 'onOpen'>

function LinkRenderer(props: { href: string; children: ReactElement }) {
  return (
    <a href={props.href} target='_blank' rel='noreferrer'>
      {props.children}
    </a>
  )
}

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
  return (
    <MuiTooltip
      enterNextDelay={400}
      enterDelay={enterDelay}
      title={
        data && typeof data === 'string' ? (
          <div className='tooltip-markdown-wrapper'>
            <Markdown components={{ a: LinkRenderer }}>{data}</Markdown>
          </div>
        ) : (
          data
        )
      }
      followCursor={followCursor}
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

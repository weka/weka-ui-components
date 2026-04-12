import type { ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PopperProps } from '@mui/material'
import { Tooltip as MuiTooltip } from '@mui/material'
import clsx from 'clsx'

import { useWindowResize } from '../../hooks'
import type { TooltipPlacement } from '../../utils/consts'
import { EMPTY_STRING, TOOLTIP_PLACEMENTS } from '../../utils/consts'

import styles from './tooltip.module.scss'

const DEFAULT_ENTER_DELAY = 400

export interface TooltipProps {
  children: ReactElement | ReactNode
  clear?: boolean
  data?: ReactElement | string
  extraClass?: string
  extraPopperClass?: string
  enterDelay?: number
  enterNextDelay?: number
  followCursor?: boolean
  placement?: TooltipPlacement
  ellipsis?: boolean
  ellipsisClass?: string
  dataTestId?: string
  PopperProps?: Partial<PopperProps>
}

export function Tooltip({
  children,
  placement = TOOLTIP_PLACEMENTS.BOTTOM,
  clear = false,
  data = EMPTY_STRING,
  extraClass = EMPTY_STRING,
  extraPopperClass = EMPTY_STRING,
  enterDelay = DEFAULT_ENTER_DELAY,
  enterNextDelay = DEFAULT_ENTER_DELAY,
  followCursor = false,
  ellipsis = false,
  ellipsisClass,
  dataTestId,
  PopperProps: popperProps,
  ...rest
}: Readonly<TooltipProps>) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const checkTruncation = useCallback(() => {
    const element = spanRef.current
    if (!element) {
      return false
    }

    return (
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight
    )
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (checkTruncation()) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true)
      }, enterDelay)
    }
  }, [checkTruncation, enterDelay])

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(false)
  }, [])

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    },
    []
  )

  useWindowResize(
    useCallback(() => {
      if (isOpen && !checkTruncation()) {
        setIsOpen(false)
      }
    }, [isOpen, checkTruncation]),
    [isOpen, checkTruncation]
  )

  const classes = clsx(
    styles.tooltipWrapper,
    extraClass,
    clear && styles.clearTooltip
  )

  const tooltipContent = data || children

  if (!ellipsis) {
    if (!data) {
      return children as ReactElement
    }

    return (
      <MuiTooltip
        arrow={false}
        enterDelay={enterDelay}
        enterNextDelay={enterNextDelay}
        followCursor={followCursor}
        placement={placement}
        title={data}
        classes={{
          tooltip: classes,
          popper: extraPopperClass
        }}
        {...(popperProps && { PopperProps: popperProps })}
        {...(typeof data === 'string' && { 'aria-label': data })}
        {...rest}
      >
        <span
          className={styles.tooltipChildWrapper}
          data-testid={dataTestId}
        >
          {children}
        </span>
      </MuiTooltip>
    )
  }

  return (
    <MuiTooltip
      arrow={false}
      enterDelay={enterDelay}
      enterNextDelay={enterNextDelay}
      followCursor={followCursor}
      open={isOpen}
      placement={placement}
      title={tooltipContent}
      classes={{
        tooltip: classes,
        popper: extraPopperClass
      }}
      {...(popperProps && { PopperProps: popperProps })}
      {...(typeof tooltipContent === 'string' && {
        'aria-label': tooltipContent
      })}
      {...rest}
    >
      <span
        ref={spanRef}
        className={clsx(styles.ellipsisWrapper, ellipsisClass)}
        data-testid={dataTestId}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
    </MuiTooltip>
  )
}

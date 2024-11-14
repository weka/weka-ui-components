import React, { useState, useRef } from 'react'
import Tooltip from '../Tooltip'

export type CursorTooltipProps = {
  children: React.ReactElement
  data?: React.ReactElement | string
  extraClass?: string
  extraPopperClass?: string
  enterDelay?: number
  disappearAfterTimeout?: number
} & React.ComponentProps<typeof Tooltip>

function CursorTooltip({
  children,
  enterDelay = 1000,
  ...rest
}: CursorTooltipProps) {
  const [open, setOpen] = useState(false)
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (moveTimerRef.current) {
      clearTimeout(moveTimerRef.current)
    }
    moveTimerRef.current = setTimeout(() => {
      setOpen(true)
    }, enterDelay)
  }

  const handleMouseLeave = () => {
    if (moveTimerRef.current) {
      clearTimeout(moveTimerRef.current)
    }
    setOpen(false)
  }

  const handleMouseMove = () => {
    if (open) {
      setOpen(false)
    }
    if (moveTimerRef.current) {
      clearTimeout(moveTimerRef.current)
    }
    moveTimerRef.current = setTimeout(() => {
      setOpen(true)
    }, enterDelay)
  }

  return (
    <Tooltip open={open} followCursor enterDelay={enterDelay} {...rest}>
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseMove: handleMouseMove
      })}
    </Tooltip>
  )
}

export default CursorTooltip

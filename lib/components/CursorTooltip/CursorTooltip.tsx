import {
  cloneElement,
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  useRef,
  useState
} from 'react'

import Tooltip from '../Tooltip'

export type CursorTooltipProps = {
  children: ReactElement<HTMLAttributes<HTMLElement>>
  disappearAfterTimeout?: number
} & ComponentProps<typeof Tooltip>

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

  // eslint-disable-next-line react-hooks/refs -- the ref is only read inside the mouse handlers, not during render
  const trigger = cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove
  })

  return (
    <Tooltip
      enterDelay={enterDelay}
      followCursor
      open={open}
      {...rest}
    >
      {trigger}
    </Tooltip>
  )
}

export default CursorTooltip

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import { clsx } from 'clsx'

import { CloseWithBgIcon } from '../../icons'
import { CSS_VARS, EMPTY_STRING, TOOLTIP_PLACEMENTS } from '../../utils/consts'
import { Tooltip } from '../Tooltip'

import styles from './chip.module.scss'

const CLOSE_ICON_SIZE = 14

export interface ChipProps {
  children: ReactNode
  extraClass?: string
  backgroundColor?: string
  textColor?: string
  closable?: boolean
  closeIconFill?: string
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  maxWidth?: string
}

export function Chip({
  children,
  extraClass,
  backgroundColor,
  textColor,
  closable = false,
  closeIconFill = CSS_VARS.GRAY_900_100,
  onClose,
  onClick,
  maxWidth
}: Readonly<ChipProps>) {
  const chipStyle = {
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),
    ...(maxWidth && { maxWidth })
  }

  const chipContentRef = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [fullText, setFullText] = useState<string>(EMPTY_STRING)

  useEffect(() => {
    if (!chipContentRef.current) {
      return
    }

    const checkTruncation = () => {
      const element = chipContentRef.current
      if (!element) {
        return
      }

      const text = element.textContent?.trim() || EMPTY_STRING
      setFullText(text)
      const isContentTruncated = element.scrollWidth > element.clientWidth
      setIsTruncated(isContentTruncated)
    }
    const timeoutId = setTimeout(() => {
      checkTruncation()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation()
    })

    if (chipContentRef.current) {
      resizeObserver.observe(chipContentRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [children, maxWidth])

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    event.nativeEvent.stopImmediatePropagation()
    if (onClose) {
      onClose(event)
    }
  }

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    event.nativeEvent.stopImmediatePropagation()
  }

  const chipElement = (
    <div
      className={clsx(styles.chip, extraClass)}
      onClick={onClick}
      style={chipStyle}
    >
      <span className={styles.chipContent}>
        <span
          ref={chipContentRef}
          className={styles.chipText}
        >
          {children}
        </span>
      </span>
      {closable ? (
        <button
          className={styles.chipClose}
          onClick={handleClose}
          onMouseDown={handleMouseDown}
          type='button'
        >
          <CloseWithBgIcon
            color={closeIconFill}
            height={CLOSE_ICON_SIZE}
            width={CLOSE_ICON_SIZE}
          />
        </button>
      ) : null}
    </div>
  )

  if (isTruncated && fullText) {
    return (
      <Tooltip
        data={fullText}
        placement={TOOLTIP_PLACEMENTS.TOP}
      >
        {chipElement}
      </Tooltip>
    )
  }

  return chipElement
}

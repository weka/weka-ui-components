import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import { clsx } from 'clsx'

import { CSS_VARS, EMPTY_STRING, TOOLTIP_PLACEMENTS } from '#v2/utils/consts'

import { CloseWithBgIcon } from '../../icons'
import { Tooltip } from '../Tooltip'

import styles from './chip.module.scss'

const CLOSE_ICON_SIZE = 14

export interface ChipProps {
  children: ReactNode
  extraClass?: string
  backgroundColor?: string
  textColor?: string
  /** Renders an outlined chip (1px border, this color) instead of a filled one — the background stays transparent unless `backgroundColor` is also set. */
  borderColor?: string
  /** Overrides the chip's corner radius (e.g. `'99px'` for a pill) — set via inline style so it always wins over `extraClass`, regardless of CSS module load order. */
  borderRadius?: string
  /** Rendered before the text at 14px, coloured with the chip's text colour. */
  icon?: ReactNode
  /** Renders the text bold instead of the default regular weight. */
  bold?: boolean
  closable?: boolean
  closeIconFill?: string
  /** Accessible name for the delete button — it shows only an icon, so give it one whenever `closable` is set. */
  closeAriaLabel?: string
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  maxWidth?: string
}

type ChipStyleProps = Pick<
  ChipProps,
  'backgroundColor' | 'textColor' | 'borderColor' | 'borderRadius' | 'maxWidth'
>

function buildChipStyle({
  backgroundColor,
  textColor,
  borderColor,
  borderRadius,
  maxWidth
}: ChipStyleProps): CSSProperties {
  return {
    ...(backgroundColor && { backgroundColor }),
    ...(borderColor && {
      border: `1px solid ${borderColor}`,
      ...(backgroundColor ? {} : { background: 'transparent' })
    }),
    ...(textColor && { color: textColor }),
    ...(borderRadius && { borderRadius }),
    ...(maxWidth && { maxWidth })
  }
}

export function Chip({
  children,
  extraClass,
  backgroundColor,
  textColor,
  borderColor,
  borderRadius,
  icon,
  bold = false,
  closable = false,
  closeIconFill = CSS_VARS.GRAY_900_100,
  closeAriaLabel,
  onClose,
  onClick,
  maxWidth
}: Readonly<ChipProps>) {
  const chipStyle = buildChipStyle({
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    maxWidth
  })

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
      className={clsx(styles.chip, bold && styles.bold, extraClass)}
      onClick={onClick}
      style={chipStyle}
    >
      <span className={styles.chipContent}>
        {icon ? <span className={styles.chipIcon}>{icon}</span> : null}
        <span
          ref={chipContentRef}
          className={styles.chipText}
        >
          {children}
        </span>
      </span>
      {closable ? (
        <button
          aria-label={closeAriaLabel}
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

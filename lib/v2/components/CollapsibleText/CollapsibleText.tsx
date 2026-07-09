import { useCallback, useEffect, useRef, useState } from 'react'

import { ELLIPSIS } from '#v2/utils/consts'

import styles from './collapsibleText.module.scss'

export interface CollapsibleTextProps {
  text: string
  maxLines?: number
  showMoreLabel?: string
  showLessLabel?: string
  dataTestId?: string
}

interface TruncationResult {
  needsCollapsing: boolean
  truncatedText: string
}

const SPACE_BUFFER = 80
const DEFAULT_MAX_LINES = 2
const DEFAULT_SHOW_MORE_LABEL = 'Show more'
const DEFAULT_SHOW_LESS_LABEL = 'Show less'

function getCanvasFont(element: HTMLElement): string {
  const style = getComputedStyle(element)
  return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
}

function calculateTruncationWithCanvas(
  container: HTMLDivElement,
  text: string,
  maxLines: number,
  showMoreLabel: string
): TruncationResult {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return { needsCollapsing: false, truncatedText: text }
  }

  const containerWidth = container.offsetWidth

  if (containerWidth <= 0) {
    return { needsCollapsing: false, truncatedText: text }
  }

  ctx.font = getCanvasFont(container)
  const fullTextWidth = ctx.measureText(text).width
  const totalAvailableWidth = containerWidth * maxLines

  if (fullTextWidth <= totalAvailableWidth) {
    return { needsCollapsing: false, truncatedText: text }
  }

  const ellipsisWidth = ctx.measureText(ELLIPSIS).width
  const showMoreWidth = ctx.measureText(` ${showMoreLabel}`).width
  const reservedWidth = ellipsisWidth + showMoreWidth + SPACE_BUFFER

  const lastLineAvailable = containerWidth - reservedWidth
  const previousLinesWidth = containerWidth * (maxLines - 1)
  const targetWidth = previousLinesWidth + lastLineAvailable

  let truncatedText = text
  let currentWidth = fullTextWidth

  while (currentWidth > targetWidth && truncatedText.length > 0) {
    truncatedText = truncatedText.slice(0, -1)
    currentWidth = ctx.measureText(truncatedText).width
  }

  while (truncatedText.length > 0 && truncatedText.endsWith(' ')) {
    truncatedText = truncatedText.slice(0, -1)
  }

  if (truncatedText.length < text.length) {
    truncatedText = truncatedText + ELLIPSIS
  }

  return { needsCollapsing: true, truncatedText }
}

export function CollapsibleText({
  text,
  maxLines = DEFAULT_MAX_LINES,
  showMoreLabel = DEFAULT_SHOW_MORE_LABEL,
  showLessLabel = DEFAULT_SHOW_LESS_LABEL,
  dataTestId
}: Readonly<CollapsibleTextProps>) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [truncationResult, setTruncationResult] = useState<
    TruncationResult & { sourceText: string }
  >({
    needsCollapsing: false,
    truncatedText: text,
    sourceText: text
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const isStale = truncationResult.sourceText !== text
  const currentResult: TruncationResult = isStale
    ? { needsCollapsing: false, truncatedText: text }
    : truncationResult
  const currentExpanded = isStale ? false : isExpanded

  const recalculate = useCallback(
    (resetExpanded = false) => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const result = calculateTruncationWithCanvas(
        container,
        text,
        maxLines,
        showMoreLabel
      )
      setTruncationResult({ ...result, sourceText: text })
      if (resetExpanded) {
        setIsExpanded(false)
      }
    },
    [text, maxLines, showMoreLabel]
  )

  const prevTextRef = useRef(text)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const textChanged = prevTextRef.current !== text
    prevTextRef.current = text

    const frameId = requestAnimationFrame(() => {
      recalculate(textChanged)
    })

    const resizeObserver = new ResizeObserver(() => {
      recalculate(false)
    })

    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [recalculate, text])

  const handleToggle = () => {
    setIsExpanded(!currentExpanded)
  }

  const { needsCollapsing, truncatedText } = currentResult

  return (
    <div
      ref={containerRef}
      className={styles.collapsibleContainer}
      data-testid={dataTestId}
    >
      <span className={styles.textWrapper}>
        <span className={styles.textContent}>
          {currentExpanded ? text : truncatedText}
        </span>
        {needsCollapsing ? (
          <button
            className={styles.toggleButton}
            onClick={handleToggle}
            type='button'
          >
            {currentExpanded ? showLessLabel : showMoreLabel}
          </button>
        ) : null}
      </span>
    </div>
  )
}

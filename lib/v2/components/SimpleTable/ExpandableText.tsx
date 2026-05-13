import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'

import { ARROW_DIRECTIONS, ArrowIcon } from '../../icons'

import { useExpandableTextContext } from './ExpandableTextContext'

import styles from './expandableText.module.scss'

export interface ExpandableTextProps {
  text: string
  maxLines?: number
}

const LINE_HEIGHT_COEFFICIENT = 1.4
const OVERFLOW_TOLERANCE_PX = 2
const ARROW_SIZE = 12
const DEFAULT_MAX_LINES = 2

export function ExpandableText({
  text,
  maxLines = DEFAULT_MAX_LINES
}: Readonly<ExpandableTextProps>) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowExpand, setShouldShowExpand] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const { hasExpandableContent, registerExpandable, unregisterExpandable } =
    useExpandableTextContext()
  const componentId = useId()

  useEffect(() => {
    const checkOverflow = () => {
      if (!textRef.current) {
        return
      }
      const element = textRef.current

      const originalClamp = element.style.webkitLineClamp
      const originalDisplay = element.style.display
      const originalOverflow = element.style.overflow

      element.style.webkitLineClamp = 'none'
      element.style.display = 'block'
      element.style.overflow = 'visible'

      const fullHeight = element.scrollHeight

      element.style.webkitLineClamp = originalClamp
      element.style.display = originalDisplay
      element.style.overflow = originalOverflow

      const computedStyle = getComputedStyle(element)
      const lineHeight =
        parseFloat(computedStyle.lineHeight) ||
        parseFloat(computedStyle.fontSize) * LINE_HEIGHT_COEFFICIENT
      const maxHeight = lineHeight * maxLines

      const needsExpansion = fullHeight > maxHeight + OVERFLOW_TOLERANCE_PX
      setShouldShowExpand(needsExpansion)
      registerExpandable(componentId, needsExpansion)
    }

    const timer = setTimeout(checkOverflow, 0)
    return () => {
      clearTimeout(timer)
      unregisterExpandable(componentId)
    }
  }, [text, maxLines, componentId, registerExpandable, unregisterExpandable])

  return (
    <div
      className={clsx(styles.expandableContainer, {
        [styles.expandableContainerWithPadding]: hasExpandableContent
      })}
    >
      {shouldShowExpand ? (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ArrowIcon
            size={ARROW_SIZE}
            direction={
              isExpanded ? ARROW_DIRECTIONS.UP : ARROW_DIRECTIONS.RIGHT
            }
          />
        </button>
      ) : null}
      <div
        ref={textRef}
        style={{ WebkitLineClamp: isExpanded ? 'none' : maxLines }}
        className={clsx(styles.expandableText, {
          [styles.expandableTextExpanded]: isExpanded
        })}
      >
        {text}
      </div>
    </div>
  )
}

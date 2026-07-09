import {
  cloneElement,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'

import styles from './stableChartContainer.module.scss'

interface StableChartContainerProps {
  children: ReactElement
  extraClass?: string
}

interface ChartSize {
  width: number
  height: number
}

const RESIZE_SETTLE_MS = 150

/**
 * Measures its own size via ResizeObserver and injects explicit width/height
 * into the child chart, debouncing resizes so charts don't re-render mid-drag.
 * The child is not rendered until a non-zero size is known.
 */
export function StableChartContainer({
  children,
  extraClass
}: Readonly<StableChartContainerProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 })

  const updateSize = useCallback((width: number, height: number) => {
    setSize((prev) => {
      if (prev.width === width && prev.height === height) {
        return prev
      }
      return { width, height }
    })
  }, [])

  useEffect(() => {
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let hasInitialSize = false

    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (!entry) {
        return
      }
      const { width, height } = entry.contentRect

      if (!hasInitialSize && width > 0 && height > 0) {
        hasInitialSize = true
        clearTimeout(settleTimer)
        updateSize(width, height)
        return
      }

      clearTimeout(settleTimer)
      settleTimer = setTimeout(
        () => updateSize(width, height),
        RESIZE_SETTLE_MS
      )
    })
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      clearTimeout(settleTimer)
      observer.disconnect()
    }
  }, [updateSize])

  return (
    <div
      ref={ref}
      className={clsx(styles.chartWrapper, extraClass)}
    >
      {size.width > 0 &&
        size.height > 0 &&
        cloneElement(children, {
          width: size.width,
          height: size.height
        })}
    </div>
  )
}

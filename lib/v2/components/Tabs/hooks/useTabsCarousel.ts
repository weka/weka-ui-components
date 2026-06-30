import type { ScrollDirection } from '../tabsConstants'
import type { MutableRefObject, RefObject } from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'

import { SCROLL_DIRECTIONS } from '../tabsConstants'
import {
  calculateLeftScrollTarget,
  calculateRightScrollTarget,
  SCROLL_THRESHOLD,
  TAB_SCROLL_OFFSET
} from './tabsCarouselUtils'

interface UseTabsCarouselProps {
  isEnabled: boolean
  tabsCount: number
}

interface UseTabsCarouselReturn {
  tabsContainerRef: RefObject<HTMLDivElement>
  tabRefs: MutableRefObject<Map<string, HTMLDivElement>>
  showLeftArrow: boolean
  showRightArrow: boolean
  scrollTabs: (direction: ScrollDirection) => void
  scrollToTab: (tabId: string) => void
}

/**
 * Custom hook to manage tabs carousel functionality.
 * Provides scroll detection, navigation arrows, and smooth scrolling.
 */
export function useTabsCarousel({
  isEnabled,
  tabsCount
}: UseTabsCarouselProps): UseTabsCarouselReturn {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const checkScrollButtons = useCallback(() => {
    if (!tabsContainerRef.current || !isEnabled) {
      setShowLeftArrow(false)
      setShowRightArrow(false)
      return
    }

    const container = tabsContainerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container

    setShowLeftArrow(scrollLeft > SCROLL_THRESHOLD)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - SCROLL_THRESHOLD)
  }, [isEnabled])

  const scrollTabs = useCallback((direction: ScrollDirection) => {
    if (!tabsContainerRef.current) {
      return
    }

    const container = tabsContainerRef.current
    const { scrollLeft, clientWidth } = container

    const sortedTabs = Array.from(tabRefs.current.values()).sort(
      (a, b) => a.offsetLeft - b.offsetLeft
    )

    if (sortedTabs.length === 0) {
      return
    }

    const targetScroll =
      direction === SCROLL_DIRECTIONS.LEFT
        ? calculateLeftScrollTarget(sortedTabs, scrollLeft)
        : calculateRightScrollTarget(sortedTabs, scrollLeft, clientWidth)

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }, [])

  const scrollToTab = useCallback(
    (tabId: string) => {
      if (!isEnabled || !tabsContainerRef.current) {
        return
      }

      const activeTabElement = tabRefs.current.get(tabId)
      if (!activeTabElement) {
        return
      }

      const container = tabsContainerRef.current
      const tabRect = activeTabElement.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      if (tabRect.left < containerRect.left) {
        container.scrollTo({
          left: activeTabElement.offsetLeft - TAB_SCROLL_OFFSET,
          behavior: 'smooth'
        })
        return
      }

      if (tabRect.right > containerRect.right) {
        container.scrollTo({
          left:
            activeTabElement.offsetLeft -
            containerRect.width +
            activeTabElement.offsetWidth +
            TAB_SCROLL_OFFSET,
          behavior: 'smooth'
        })
      }
    },
    [isEnabled]
  )

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      checkScrollButtons()
    })

    if (!tabsContainerRef.current || !isEnabled) {
      return () => cancelAnimationFrame(frameId)
    }

    const container = tabsContainerRef.current
    const resizeObserver = new ResizeObserver(checkScrollButtons)
    resizeObserver.observe(container)

    container.addEventListener('scroll', checkScrollButtons)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [checkScrollButtons, isEnabled, tabsCount])

  return {
    tabsContainerRef,
    tabRefs,
    showLeftArrow,
    showRightArrow,
    scrollTabs,
    scrollToTab
  }
}

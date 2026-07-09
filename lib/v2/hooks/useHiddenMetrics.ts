import { useCallback, useState } from 'react'

import { EMPTY_SET } from '#v2/utils/consts'

/**
 * Tracks which chart series/metrics are hidden (e.g. toggled off via a legend).
 * Returns the hidden-key set plus toggle/show-all/hide-all helpers.
 */
export function useHiddenMetrics(initialHidden: Set<string> = EMPTY_SET) {
  const [hiddenMetrics, setHiddenMetrics] = useState<Set<string>>(initialHidden)

  const toggleMetric = useCallback((key: string) => {
    setHiddenMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const showAll = useCallback(() => {
    setHiddenMetrics(EMPTY_SET)
  }, [])

  const hideAll = useCallback((metricKeys: string[]) => {
    setHiddenMetrics(new Set(metricKeys))
  }, [])

  const isHidden = useCallback(
    (key: string) => hiddenMetrics.has(key),
    [hiddenMetrics]
  )

  return {
    hiddenMetrics,
    setHiddenMetrics,
    toggleMetric,
    showAll,
    hideAll,
    isHidden
  }
}

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useHiddenMetrics } from './useHiddenMetrics'

describe('useHiddenMetrics', () => {
  it('starts with no hidden metrics by default', () => {
    const { result } = renderHook(() => useHiddenMetrics())

    expect(result.current.hiddenMetrics.size).toBe(0)
  })

  it('starts with the provided initial set', () => {
    const { result } = renderHook(() =>
      useHiddenMetrics(new Set(['throughput']))
    )

    expect(result.current.isHidden('throughput')).toBe(true)
  })

  it('toggles a metric into the hidden set and back out', () => {
    const { result } = renderHook(() => useHiddenMetrics())

    act(() => result.current.toggleMetric('iops'))
    expect(result.current.isHidden('iops')).toBe(true)

    act(() => result.current.toggleMetric('iops'))
    expect(result.current.isHidden('iops')).toBe(false)
  })

  it('hides all given metric keys', () => {
    const { result } = renderHook(() => useHiddenMetrics())

    act(() => result.current.hideAll(['iops', 'latency']))

    expect(result.current.isHidden('iops')).toBe(true)
    expect(result.current.isHidden('latency')).toBe(true)
  })

  it('shows all metrics again', () => {
    const { result } = renderHook(() => useHiddenMetrics())
    act(() => result.current.hideAll(['iops', 'latency']))

    act(() => result.current.showAll())

    expect(result.current.hiddenMetrics.size).toBe(0)
  })
})

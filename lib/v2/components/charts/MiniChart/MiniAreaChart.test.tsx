import type { MiniChartDataPoint } from './MiniChart'

import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MiniAreaChart } from './MiniAreaChart'

const responsiveContainerHeightSpy = vi.fn()

vi.mock('recharts', () => ({
  Area: () => null,
  AreaChart: ({ children }: { children?: unknown }) => children ?? null,
  ResponsiveContainer: ({
    children,
    height
  }: {
    children?: unknown
    height?: number | string
  }) => {
    responsiveContainerHeightSpy(height)
    return children ?? null
  },
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

const DATA: MiniChartDataPoint[] = [
  { time: '10:00', value: 100 },
  { time: '10:01', value: 250 }
]
const COLOR = 'var(--cyan-500)'
const HEIGHT = 50

describe('MiniAreaChart', () => {
  it('uses the numeric height by default', () => {
    responsiveContainerHeightSpy.mockClear()
    render(
      <MiniAreaChart
        color={COLOR}
        data={DATA}
        hasValidData
        height={HEIGHT}
      />
    )

    expect(responsiveContainerHeightSpy).toHaveBeenCalledWith(HEIGHT)
  })

  it('fills the container height when fill is set', () => {
    responsiveContainerHeightSpy.mockClear()
    render(
      <MiniAreaChart
        color={COLOR}
        data={DATA}
        fill
        hasValidData
        height={HEIGHT}
      />
    )

    expect(responsiveContainerHeightSpy).toHaveBeenCalledWith('100%')
  })
})

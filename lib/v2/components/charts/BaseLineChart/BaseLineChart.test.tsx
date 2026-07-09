import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { BaseLineChart } from './BaseLineChart'

const { lineMock } = vi.hoisted(() => ({ lineMock: vi.fn() }))

vi.mock('../StableChartContainer', () => ({
  StableChartContainer: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children
}))

vi.mock('recharts', () => ({
  CartesianGrid: () => null,
  ComposedChart: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children ?? null,
  Line: (props: Readonly<{ dataKey?: string }>) => {
    lineMock(props)
    return null
  },
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

const READ_COLOR = 'var(--blue-500)'
const WRITE_COLOR = 'var(--aqua-500)'

const SERIES: SeriesConfig[] = [
  { key: 'read', name: 'Read', color: READ_COLOR, type: SERIES_TYPES.LINE },
  { key: 'write', name: 'Write', color: WRITE_COLOR, type: SERIES_TYPES.LINE }
]

const DATA: ChartDataPoint[] = [
  { timestamp: 1700000000000, read: 100, write: 40 },
  { timestamp: 1700000060000, read: 120, write: 55 }
]

describe('BaseLineChart', () => {
  beforeEach(() => {
    lineMock.mockClear()
  })

  it('renders the loading state when isLoading', () => {
    render(
      <BaseLineChart
        data={DATA}
        isLoading
        series={SERIES}
      />
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(lineMock).not.toHaveBeenCalled()
  })

  it('renders the error state when isError', () => {
    render(
      <BaseLineChart
        data={DATA}
        isError
        series={SERIES}
      />
    )

    expect(screen.getByTestId('error-state')).toBeInTheDocument()
  })

  it('renders the empty chart state when noData', () => {
    render(
      <BaseLineChart
        data={DATA}
        noData
        series={SERIES}
      />
    )

    expect(screen.getByText('No Current Data')).toBeInTheDocument()
    expect(lineMock).not.toHaveBeenCalled()
  })

  it('renders a line per series with its color', () => {
    render(
      <BaseLineChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(lineMock).toHaveBeenCalledTimes(SERIES.length)
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'read', stroke: READ_COLOR })
    )
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'write', stroke: WRITE_COLOR })
    )
  })

  it('hides series listed in hiddenMetrics', () => {
    render(
      <BaseLineChart
        data={DATA}
        hiddenMetrics={new Set(['write'])}
        series={SERIES}
      />
    )

    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'read', hide: false })
    )
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'write', hide: true })
    )
  })
})

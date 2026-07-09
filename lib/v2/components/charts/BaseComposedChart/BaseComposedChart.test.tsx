import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { BaseComposedChart } from './BaseComposedChart'

const { areaMock, barMock, lineMock } = vi.hoisted(() => ({
  areaMock: vi.fn(),
  barMock: vi.fn(),
  lineMock: vi.fn()
}))

type MockSeriesProps = Readonly<{ dataKey?: string }>

vi.mock('../StableChartContainer', () => ({
  StableChartContainer: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children
}))

vi.mock('recharts', () => ({
  Area: (props: MockSeriesProps) => {
    areaMock(props)
    return null
  },
  Bar: (props: MockSeriesProps) => {
    barMock(props)
    return null
  },
  CartesianGrid: () => null,
  ComposedChart: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children ?? null,
  Line: (props: MockSeriesProps) => {
    lineMock(props)
    return null
  },
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

const BLUE_FADE_GRADIENT = 'url(#gradient-blue-fade-500)'
const LINE_COLOR = 'var(--aqua-500)'
const BAR_COLOR = 'var(--purple-500)'

const SERIES: SeriesConfig[] = [
  {
    key: 'read',
    name: 'Read',
    color: BLUE_FADE_GRADIENT,
    type: SERIES_TYPES.AREA
  },
  { key: 'write', name: 'Write', color: LINE_COLOR, type: SERIES_TYPES.LINE },
  { key: 'total', name: 'Total', color: BAR_COLOR, type: SERIES_TYPES.BAR }
]

const DATA: ChartDataPoint[] = [
  { timestamp: 1700000000000, read: 100, write: 40, total: 140 },
  { timestamp: 1700000060000, read: 120, write: 55, total: 175 }
]

describe('BaseComposedChart', () => {
  beforeEach(() => {
    areaMock.mockClear()
    barMock.mockClear()
    lineMock.mockClear()
  })

  it('renders the loading state when isLoading', () => {
    render(
      <BaseComposedChart
        data={DATA}
        isLoading
        series={SERIES}
      />
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(areaMock).not.toHaveBeenCalled()
  })

  it('renders the error state when isError', () => {
    render(
      <BaseComposedChart
        data={DATA}
        isError
        series={SERIES}
      />
    )

    expect(screen.getByTestId('error-state')).toBeInTheDocument()
  })

  it('renders the empty chart state when noData', () => {
    render(
      <BaseComposedChart
        data={DATA}
        noData
        series={SERIES}
      />
    )

    expect(screen.getByText('No Current Data')).toBeInTheDocument()
    expect(areaMock).not.toHaveBeenCalled()
  })

  it('renders the matching recharts element per series type', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(areaMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'read' })
    )
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'write', stroke: LINE_COLOR })
    )
    expect(barMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'total', fill: BAR_COLOR })
    )
  })

  it('derives a solid stroke color for gradient-filled areas', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(areaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'read',
        fill: BLUE_FADE_GRADIENT,
        stroke: 'var(--blue-500)'
      })
    )
  })

  it('renders the default fade gradient defs', () => {
    const { container } = render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(
      container.querySelector('#gradient-blue-fade-500')
    ).toBeInTheDocument()
  })

  it('hides series listed in hiddenMetrics', () => {
    render(
      <BaseComposedChart
        data={DATA}
        hiddenMetrics={new Set(['read', 'total'])}
        series={SERIES}
      />
    )

    expect(areaMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'read', hide: true })
    )
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'write', hide: false })
    )
    expect(barMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'total', hide: true })
    )
  })
})

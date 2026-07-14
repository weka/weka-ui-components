import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { BaseComposedChart } from './BaseComposedChart'

const {
  areaMock,
  barMock,
  brushMock,
  lineMock,
  yAxisMock,
  referenceAreaMock,
  composedChartMock
} = vi.hoisted(() => ({
  areaMock: vi.fn(),
  barMock: vi.fn(),
  brushMock: vi.fn(),
  lineMock: vi.fn(),
  yAxisMock: vi.fn(),
  referenceAreaMock: vi.fn(),
  composedChartMock: vi.fn()
}))

type MockSeriesProps = Readonly<{
  dataKey?: string
  strokeDasharray?: string
  yAxisId?: string
}>

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
  Brush: (
    props: Readonly<{
      dataKey?: string
      fill?: string
      height?: number
      stroke?: string
      tickFormatter?: (value: number | string, index: number) => string
      travellerWidth?: number
    }>
  ) => {
    brushMock(props)
    return null
  },
  CartesianGrid: () => null,
  ComposedChart: (props: Readonly<{ children?: ReactNode }>) => {
    composedChartMock(props)
    const { children } = props
    return <>{children}</>
  },
  ReferenceArea: (props: Readonly<{ x1?: unknown; x2?: unknown }>) => {
    referenceAreaMock(props)
    return null
  },
  Line: (props: MockSeriesProps) => {
    lineMock(props)
    return null
  },
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: (
    props: Readonly<{
      domain?: unknown
      orientation?: string
      yAxisId?: string
    }>
  ) => {
    yAxisMock(props)
    return null
  }
}))

const BLUE_FADE_GRADIENT = 'url(#gradient-blue-fade-500)'
const LINE_COLOR = 'var(--aqua-500)'
const BAR_COLOR = 'var(--purple-500)'
const FORECAST_SERIES_KEY = 'forecast'
const FORECAST_AXIS_ID = 'forecast-axis'

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
    brushMock.mockClear()
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

describe('BaseComposedChart drag-to-select', () => {
  beforeEach(() => {
    referenceAreaMock.mockClear()
    composedChartMock.mockClear()
  })

  it('renders a ReferenceArea overlay spanning the selected range', () => {
    render(
      <BaseComposedChart
        data={DATA}
        referenceArea={{ x1: 1700000000000, x2: 1700000060000 }}
        series={SERIES}
      />
    )

    expect(referenceAreaMock).toHaveBeenCalledWith(
      expect.objectContaining({ x1: 1700000000000, x2: 1700000060000 })
    )
  })

  it('does not render a ReferenceArea when no range is selected', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(referenceAreaMock).not.toHaveBeenCalled()
  })

  it('forwards the drag mouse handlers to the chart', () => {
    const onMouseDown = vi.fn()
    const onMouseMove = vi.fn()
    const onMouseUp = vi.fn()
    render(
      <BaseComposedChart
        data={DATA}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        series={SERIES}
      />
    )

    expect(composedChartMock).toHaveBeenCalledWith(
      expect.objectContaining({ onMouseDown, onMouseMove, onMouseUp })
    )
  })
})

describe('BaseComposedChart Brush', () => {
  beforeEach(() => {
    brushMock.mockClear()
  })

  it('renders a Brush when showBrush is true', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
        showBrush
      />
    )

    expect(brushMock).toHaveBeenCalledTimes(1)
  })

  it('passes the xAxis tickFormatter through to the Brush', () => {
    const formatDateTick = (value: number | string) =>
      new Date(Number(value)).toISOString()

    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
        showBrush
        xAxis={{ dataKey: 'timestamp', tickFormatter: formatDateTick }}
      />
    )

    expect(brushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'timestamp',
        tickFormatter: formatDateTick
      })
    )
  })

  it('styles the Brush with theme tokens and a wider traveller handle', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
        showBrush
      />
    )

    expect(brushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fill: 'var(--gray-300-700)',
        stroke: 'var(--gray-650-350)',
        travellerWidth: 8
      })
    )
  })

  it('does not render a Brush by default', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(brushMock).not.toHaveBeenCalled()
  })
})

describe('BaseComposedChart secondary y-axis and dashed lines', () => {
  beforeEach(() => {
    areaMock.mockClear()
    barMock.mockClear()
    lineMock.mockClear()
    yAxisMock.mockClear()
  })

  it('renders a single default y-axis when no series sets yAxisId', () => {
    render(
      <BaseComposedChart
        data={DATA}
        series={SERIES}
      />
    )

    expect(yAxisMock).toHaveBeenCalledTimes(1)
  })

  it('renders a second right-oriented y-axis when a series sets yAxisId', () => {
    const seriesWithSecondaryAxis: SeriesConfig[] = [
      ...SERIES,
      {
        key: FORECAST_SERIES_KEY,
        name: 'Forecast',
        color: LINE_COLOR,
        type: SERIES_TYPES.LINE,
        yAxisId: FORECAST_AXIS_ID
      }
    ]

    render(
      <BaseComposedChart
        data={DATA}
        series={seriesWithSecondaryAxis}
      />
    )

    expect(yAxisMock).toHaveBeenCalledTimes(2)
    expect(yAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'right',
        yAxisId: FORECAST_AXIS_ID
      })
    )
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: FORECAST_SERIES_KEY,
        yAxisId: FORECAST_AXIS_ID
      })
    )
  })

  it('renders a dashed line for series with dashed: true', () => {
    const seriesWithDashedLine: SeriesConfig[] = [
      ...SERIES,
      {
        key: FORECAST_SERIES_KEY,
        name: 'Forecast',
        color: LINE_COLOR,
        type: SERIES_TYPES.LINE,
        dashed: true
      }
    ]

    render(
      <BaseComposedChart
        data={DATA}
        series={seriesWithDashedLine}
      />
    )

    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: FORECAST_SERIES_KEY,
        strokeDasharray: '6 4'
      })
    )
    expect(lineMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'write', strokeDasharray: undefined })
    )
  })
})

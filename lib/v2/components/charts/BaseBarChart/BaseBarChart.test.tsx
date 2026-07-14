import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BAR_CHART_ORIENTATIONS, type ChartDataPoint } from '../chartTypes'
import { BaseBarChart } from './BaseBarChart'

const { barChartMock, barMock, cartesianGridMock, xAxisMock, yAxisMock } =
  vi.hoisted(() => ({
    barChartMock: vi.fn(),
    barMock: vi.fn(),
    cartesianGridMock: vi.fn(),
    xAxisMock: vi.fn(),
    yAxisMock: vi.fn()
  }))

vi.mock('../StableChartContainer', () => ({
  StableChartContainer: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children
}))

vi.mock('recharts', () => ({
  Bar: (props: Readonly<{ dataKey?: string }>) => {
    barMock(props)
    return null
  },
  BarChart: ({
    children,
    ...props
  }: Readonly<{
    children?: unknown
    layout?: string
    margin?: Record<string, number>
  }>) => {
    barChartMock(props)
    return children ?? null
  },
  CartesianGrid: (
    props: Readonly<{ horizontal?: boolean; vertical?: boolean }>
  ) => {
    cartesianGridMock(props)
    return null
  },
  Tooltip: () => null,
  XAxis: (
    props: Readonly<{
      dataKey?: string
      domain?: unknown
      type?: string
      tickFormatter?: (value: unknown) => string
    }>
  ) => {
    xAxisMock(props)
    return null
  },
  YAxis: (
    props: Readonly<{
      dataKey?: string
      domain?: unknown
      type?: string
      tickFormatter?: (value: unknown) => string
    }>
  ) => {
    yAxisMock(props)
    return null
  }
}))

const VALUE_KEY = 'alerts'

const DATA: ChartDataPoint[] = [
  { name: 'cluster-a', alerts: 12 },
  { name: 'cluster-b', alerts: 7 }
]

describe('BaseBarChart', () => {
  beforeEach(() => {
    barChartMock.mockClear()
    barMock.mockClear()
    cartesianGridMock.mockClear()
    xAxisMock.mockClear()
    yAxisMock.mockClear()
  })

  it('renders the loading state when isLoading', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
        isLoading
      />
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(barMock).not.toHaveBeenCalled()
  })

  it('renders the error state when isError', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
        isError
      />
    )

    expect(screen.getByTestId('error-state')).toBeInTheDocument()
  })

  it('renders the empty chart state when noData', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
        noData
      />
    )

    expect(screen.getByText('No Current Data')).toBeInTheDocument()
    expect(barMock).not.toHaveBeenCalled()
  })

  it('renders a bar with the default vertical gradient fill', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
      />
    )

    expect(barMock).toHaveBeenCalledTimes(1)
    expect(barMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: VALUE_KEY,
        fill: 'url(#gradient-blue-600-400-vertical)'
      })
    )
  })

  it('renders the vertical gradient defs', () => {
    const { container } = render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
      />
    )

    expect(
      container.querySelector('#gradient-blue-600-400-vertical')
    ).toBeInTheDocument()
  })

  it('renders custom bars instead of the default bar', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
        renderCustomBars={() => <div data-testid='custom-bars' />}
      />
    )

    expect(screen.getByTestId('custom-bars')).toBeInTheDocument()
    expect(barMock).not.toHaveBeenCalled()
  })

  it('uses the default margin with a zero bottom when angledTicks is omitted', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
      />
    )

    expect(barChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: { top: 10, right: 30, left: -20, bottom: 0 }
      })
    )
  })

  it('reserves extra bottom margin for rotated tick labels when angledTicks is true', () => {
    render(
      <BaseBarChart
        angledTicks
        data={DATA}
        dataKey={VALUE_KEY}
      />
    )

    expect(barChartMock).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: { top: 10, right: 30, left: -20, bottom: 40 }
      })
    )
  })

  it('lets an explicit margin override the angledTicks default', () => {
    const explicitMargin = { top: 5, right: 5, left: 5, bottom: 5 }

    render(
      <BaseBarChart
        angledTicks
        data={DATA}
        dataKey={VALUE_KEY}
        margin={explicitMargin}
      />
    )

    expect(barChartMock).toHaveBeenCalledWith(
      expect.objectContaining({ margin: explicitMargin })
    )
  })
})

describe('BaseBarChart orientation', () => {
  beforeEach(() => {
    barChartMock.mockClear()
    barMock.mockClear()
    cartesianGridMock.mockClear()
    xAxisMock.mockClear()
    yAxisMock.mockClear()
  })

  it('assigns the category axis to X and the value axis to Y by default', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
      />
    )

    expect(barChartMock).toHaveBeenCalledWith(
      expect.objectContaining({ layout: undefined })
    )
    expect(xAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'name' })
    )
    expect(yAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({ domain: expect.any(Array) })
    )
    expect(cartesianGridMock).toHaveBeenCalledWith(
      expect.objectContaining({ horizontal: true, vertical: false })
    )
  })

  it('swaps axis roles and grid orientation when horizontal', () => {
    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
        orientation={BAR_CHART_ORIENTATIONS.HORIZONTAL}
      />
    )

    expect(barChartMock).toHaveBeenCalledWith(
      expect.objectContaining({ layout: 'vertical' })
    )
    expect(xAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({ domain: expect.any(Array), type: 'number' })
    )
    expect(yAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'name', type: 'category' })
    )
    expect(cartesianGridMock).toHaveBeenCalledWith(
      expect.objectContaining({ horizontal: false, vertical: true })
    )
  })

  it('still invokes onBarClick and applies tickFormatter when horizontal', () => {
    const handleBarClick = vi.fn()
    const formatCategoryTick = (value: unknown) => `#${String(value)}`

    render(
      <BaseBarChart
        data={DATA}
        dataKey={VALUE_KEY}
        onBarClick={handleBarClick}
        orientation={BAR_CHART_ORIENTATIONS.HORIZONTAL}
        xAxis={{ tickFormatter: formatCategoryTick }}
      />
    )

    expect(barMock).toHaveBeenCalledWith(
      expect.objectContaining({ onClick: handleBarClick })
    )
    expect(yAxisMock).toHaveBeenCalledWith(
      expect.objectContaining({ tickFormatter: formatCategoryTick })
    )
  })
})

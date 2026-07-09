import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { type ChartDataPoint } from '../chartTypes'
import { BaseBarChart } from './BaseBarChart'

const { barMock } = vi.hoisted(() => ({ barMock: vi.fn() }))

vi.mock('../StableChartContainer', () => ({
  StableChartContainer: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children
}))

vi.mock('recharts', () => ({
  Bar: (props: Readonly<{ dataKey?: string }>) => {
    barMock(props)
    return null
  },
  BarChart: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children ?? null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

const VALUE_KEY = 'alerts'

const DATA: ChartDataPoint[] = [
  { name: 'cluster-a', alerts: 12 },
  { name: 'cluster-b', alerts: 7 }
]

describe('BaseBarChart', () => {
  beforeEach(() => {
    barMock.mockClear()
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
})

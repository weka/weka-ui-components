import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MiniChart, type MiniChartDataPoint } from './MiniChart'

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

const TITLE = 'Throughput'
const DATA: MiniChartDataPoint[] = [
  { time: '10:00', value: 100 },
  { time: '10:01', value: 250 }
]
const COLOR = 'var(--cyan-500)'
const DEFAULT_HEIGHT = 50

describe('MiniChart', () => {
  it('renders the title label', () => {
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        title={TITLE}
      />
    )

    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('formats the last value with formatValue', () => {
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        formatValue={(value) => `${value} MB/s`}
        title={TITLE}
      />
    )

    expect(screen.getByText('250 MB/s')).toBeInTheDocument()
  })

  it('shows the raw last value when no formatValue is given', () => {
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        title={TITLE}
      />
    )

    expect(screen.getByText('250')).toBeInTheDocument()
  })

  it('hides the current value when hasValidData is false', () => {
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        formatValue={(value) => `${value} MB/s`}
        hasValidData={false}
        title={TITLE}
      />
    )

    expect(screen.queryByText('250 MB/s')).not.toBeInTheDocument()
  })

  it('renders a loading skeleton and hides the value while loading', () => {
    const TEST_ID = 'loading-chart'
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        dataTestId={TEST_ID}
        isLoading
        title={TITLE}
      />
    )

    expect(screen.getByTestId(`${TEST_ID}-loading`)).toBeInTheDocument()
    expect(screen.queryByTestId(`${TEST_ID}-value`)).not.toBeInTheDocument()
  })

  it('applies the dataTestId to the value and label elements', () => {
    const TEST_ID = 'throughput-chart'
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        dataTestId={TEST_ID}
        title={TITLE}
      />
    )

    expect(screen.getByTestId(`${TEST_ID}-value`)).toBeInTheDocument()
    expect(screen.getByTestId(`${TEST_ID}-label`)).toBeInTheDocument()
  })

  it('hides the last value when hideLastValue is set', () => {
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        formatValue={(value) => `${value} MB/s`}
        hideLastValue
        title={TITLE}
      />
    )

    expect(screen.queryByText('250 MB/s')).not.toBeInTheDocument()
  })

  it('renders no label when title is omitted', () => {
    const TEST_ID = 'no-title-chart'
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        dataTestId={TEST_ID}
      />
    )

    expect(screen.queryByTestId(`${TEST_ID}-label`)).not.toBeInTheDocument()
  })

  it('renders at a fixed numeric height by default', () => {
    responsiveContainerHeightSpy.mockClear()
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        title={TITLE}
      />
    )

    expect(responsiveContainerHeightSpy).toHaveBeenCalledWith(DEFAULT_HEIGHT)
  })

  it('fills the container height when fill is set', () => {
    responsiveContainerHeightSpy.mockClear()
    render(
      <MiniChart
        color={COLOR}
        data={DATA}
        fill
        title={TITLE}
      />
    )

    expect(responsiveContainerHeightSpy).toHaveBeenCalledWith('100%')
  })
})

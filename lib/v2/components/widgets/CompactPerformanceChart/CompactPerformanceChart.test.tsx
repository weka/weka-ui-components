import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CompactPerformanceChart } from './CompactPerformanceChart'

type MouseMoveHandler = (state: {
  activeTooltipIndex?: number
  activeLabel?: string
}) => void

const capturedOnMouseMove: MouseMoveHandler[] = []

vi.mock('recharts', () => ({
  Area: () => null,
  AreaChart: ({
    children,
    onMouseMove
  }: {
    children?: unknown
    onMouseMove?: MouseMoveHandler
  }) => {
    if (onMouseMove) {
      capturedOnMouseMove.push(onMouseMove)
    }
    return children ?? null
  },
  ResponsiveContainer: ({ children }: { children?: unknown }) =>
    children ?? null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

const CONTAINER_TEST_ID = 'compact-performance'
const TOOLTIP_TEST_ID = 'compact-performance-tooltip'

const buildProps = () => ({
  throughput: {
    data: [
      { time: '10:00', value: 100 },
      { time: '10:01', value: 150 }
    ],
    formatValue: (value: number) => `${value} MB/s`,
    label: 'Throughput'
  },
  iops: {
    data: [
      { time: '10:00', value: 1000 },
      { time: '10:01', value: 1500 }
    ],
    formatValue: (value: number) => `${value} ops`,
    label: 'IOPS'
  },
  latency: {
    data: [
      { time: '10:00', value: 1 },
      { time: '10:01', value: 2 }
    ],
    formatValue: (value: number) => `${value} ms`,
    label: 'Avg. Latency'
  },
  dataTestId: CONTAINER_TEST_ID
})

describe('CompactPerformanceChart', () => {
  it('renders all three charts with their labels', () => {
    render(<CompactPerformanceChart {...buildProps()} />)

    expect(
      screen.getByTestId('compact-performance-throughput')
    ).toBeInTheDocument()
    expect(screen.getByTestId('compact-performance-iops')).toBeInTheDocument()
    expect(
      screen.getByTestId('compact-performance-latency')
    ).toBeInTheDocument()
    expect(screen.getByText('Throughput')).toBeInTheDocument()
    expect(screen.getByText('IOPS')).toBeInTheDocument()
    expect(screen.getByText('Avg. Latency')).toBeInTheDocument()
  })

  it('does not render the unified tooltip before any chart is hovered', () => {
    render(<CompactPerformanceChart {...buildProps()} />)

    expect(
      screen.queryByTestId(TOOLTIP_TEST_ID)
    ).not.toBeInTheDocument()
  })

  it('shows the unified tooltip with all three values once a chart reports a hovered point', () => {
    capturedOnMouseMove.length = 0
    render(<CompactPerformanceChart {...buildProps()} />)

    act(() => {
      capturedOnMouseMove[0]({ activeTooltipIndex: 1, activeLabel: '10:01' })
    })

    expect(
      screen.getByTestId(TOOLTIP_TEST_ID)
    ).toBeInTheDocument()
    expect(screen.getByText('150 MB/s')).toBeInTheDocument()
    expect(screen.getByText('1500 ops')).toBeInTheDocument()
    expect(screen.getByText('2 ms')).toBeInTheDocument()
  })

  it('reflects a new data-prop update while the tooltip is inactive', () => {
    const props = buildProps()
    const { rerender } = render(<CompactPerformanceChart {...props} />)

    expect(screen.getByText('150 MB/s')).toBeInTheDocument()

    rerender(
      <CompactPerformanceChart
        {...props}
        throughput={{
          ...props.throughput,
          data: [...props.throughput.data, { time: '10:02', value: 999 }]
        }}
      />
    )

    expect(screen.getByText('999 MB/s')).toBeInTheDocument()
  })

  it('keeps the tooltip and charts on the pre-hover snapshot while active, ignoring a concurrent data-prop update', () => {
    capturedOnMouseMove.length = 0
    const props = buildProps()
    const { rerender } = render(<CompactPerformanceChart {...props} />)

    act(() => {
      capturedOnMouseMove[0]({ activeTooltipIndex: 1, activeLabel: '10:01' })
    })

    expect(screen.getByText('150 MB/s')).toBeInTheDocument()

    rerender(
      <CompactPerformanceChart
        {...props}
        throughput={{
          ...props.throughput,
          data: [...props.throughput.data, { time: '10:02', value: 999 }]
        }}
      />
    )

    expect(screen.getByText('150 MB/s')).toBeInTheDocument()
    expect(screen.queryByText('999 MB/s')).not.toBeInTheDocument()
  })

  it('hides the unified tooltip once the pointer leaves the chart container', () => {
    capturedOnMouseMove.length = 0
    render(<CompactPerformanceChart {...buildProps()} />)

    act(() => {
      capturedOnMouseMove[0]({ activeTooltipIndex: 1, activeLabel: '10:01' })
    })
    expect(
      screen.getByTestId(TOOLTIP_TEST_ID)
    ).toBeInTheDocument()

    fireEvent.mouseLeave(screen.getByTestId(CONTAINER_TEST_ID))

    expect(
      screen.queryByTestId(TOOLTIP_TEST_ID)
    ).not.toBeInTheDocument()
  })

  it('resumes live data immediately once the tooltip deactivates', () => {
    capturedOnMouseMove.length = 0
    const props = buildProps()
    const { rerender } = render(<CompactPerformanceChart {...props} />)

    act(() => {
      capturedOnMouseMove[0]({ activeTooltipIndex: 1, activeLabel: '10:01' })
    })

    const updatedProps = {
      ...props,
      throughput: {
        ...props.throughput,
        data: [...props.throughput.data, { time: '10:02', value: 999 }]
      }
    }
    rerender(<CompactPerformanceChart {...updatedProps} />)

    fireEvent.mouseLeave(screen.getByTestId(CONTAINER_TEST_ID))

    expect(screen.getByText('999 MB/s')).toBeInTheDocument()
  })
})

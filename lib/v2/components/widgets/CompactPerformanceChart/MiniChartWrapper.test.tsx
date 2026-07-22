import type { CompactPerformanceDataPoint, TooltipState } from './types'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { MiniChartWrapper } from './MiniChartWrapper'

type CapturedRechartsHandlers = {
  onMouseMove?: (
    state: { activeTooltipIndex?: number; activeLabel?: string },
    event?: { clientX: number; clientY: number }
  ) => void
  onMouseLeave?: () => void
}

const capturedHandlers: CapturedRechartsHandlers = {}

vi.mock('recharts', () => ({
  Area: () => null,
  AreaChart: ({
    children,
    onMouseMove,
    onMouseLeave
  }: {
    children?: unknown
    onMouseMove?: CapturedRechartsHandlers['onMouseMove']
    onMouseLeave?: CapturedRechartsHandlers['onMouseLeave']
  }) => {
    capturedHandlers.onMouseMove = onMouseMove
    capturedHandlers.onMouseLeave = onMouseLeave

    return children ?? null
  },
  ResponsiveContainer: ({ children }: { children?: unknown }) =>
    children ?? null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

const DATA: CompactPerformanceDataPoint[] = [
  { time: '10:00', value: 100 },
  { time: '10:01', value: 250 }
]

const renderWrapper = (onTooltipChange = vi.fn()) => {
  render(
    <MiniChartWrapper
      color='var(--cyan-500)'
      data={DATA}
      dataTestId='throughput-chart'
      formatValue={(value) => `${value} MB/s`}
      isHovered={false}
      label='Throughput'
      onTooltipChange={onTooltipChange}
    />
  )
  return onTooltipChange
}

describe('MiniChartWrapper', () => {
  it('renders the label and forwards the dataTestId', () => {
    renderWrapper()

    expect(screen.getByTestId('throughput-chart-label')).toBeInTheDocument()
    expect(screen.getByText('Throughput')).toBeInTheDocument()
  })

  it('preserves the prior position when recharts reports a synced hover with no event', () => {
    const onTooltipChange = renderWrapper()

    capturedHandlers.onMouseMove?.({ activeTooltipIndex: 1, activeLabel: '10:01' })

    expect(onTooltipChange).toHaveBeenCalledTimes(1)
    const updater = onTooltipChange.mock.calls[0][0] as (
      prev: TooltipState
    ) => TooltipState
    const prevState: TooltipState = {
      active: false,
      label: EMPTY_STRING,
      dataIndex: -1,
      viewportX: 42,
      viewportY: 24
    }
    expect(updater(prevState)).toEqual({
      ...prevState,
      active: true,
      label: '10:01',
      dataIndex: 1
    })
  })

  it('captures the viewport mouse coordinates when recharts reports a hovered point with an event', () => {
    const onTooltipChange = renderWrapper()

    capturedHandlers.onMouseMove?.(
      { activeTooltipIndex: 1, activeLabel: '10:01' },
      { clientX: 321, clientY: 654 }
    )

    expect(onTooltipChange).toHaveBeenCalledWith({
      active: true,
      label: '10:01',
      dataIndex: 1,
      viewportX: 321,
      viewportY: 654
    })
  })

  it('ignores a hover event with no active point', () => {
    const onTooltipChange = renderWrapper()

    capturedHandlers.onMouseMove?.({})

    expect(onTooltipChange).not.toHaveBeenCalled()
  })

  it('resets the tooltip state on mouse leave', () => {
    const onTooltipChange = renderWrapper()

    capturedHandlers.onMouseLeave?.()

    expect(onTooltipChange).toHaveBeenCalledWith({
      active: false,
      label: EMPTY_STRING,
      dataIndex: -1,
      viewportX: 0,
      viewportY: 0
    })
  })
})

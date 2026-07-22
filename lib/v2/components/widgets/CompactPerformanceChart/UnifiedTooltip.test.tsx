import type { CompactPerformanceDataPoint, UnifiedTooltipMetric } from './types'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UnifiedTooltip } from './UnifiedTooltip'

const buildMetric = (
  label: string,
  color: string,
  data: CompactPerformanceDataPoint[]
): UnifiedTooltipMetric => ({
  data,
  label,
  color,
  formatValue: (value) => `${value} u`
})

const throughputPoint: CompactPerformanceDataPoint = {
  time: '12:00:00',
  timestamp: 1704067200000,
  value: 100
}
const iopsPoint: CompactPerformanceDataPoint = {
  time: '12:00:00',
  timestamp: 1704067200000,
  value: 500
}
const latencyPoint: CompactPerformanceDataPoint = {
  time: '12:00:00',
  timestamp: 1704067200000,
  value: 1
}

const defaultProps = {
  dataIndex: 0,
  label: '12:00:00',
  metrics: [
    buildMetric('Throughput', 'var(--cyan-500)', [throughputPoint]),
    buildMetric('IOPS', 'var(--aqua-500)', [iopsPoint]),
    buildMetric('Avg. Latency', 'var(--orange-500)', [latencyPoint])
  ],
  viewportX: 100,
  viewportY: 200
}

const TOOLTIP_SELECTOR = 'div[style]'
const TOOLTIP_OFFSET_PX = 12
const TOOLTIP_WIDTH_PX = 200
const RIGHT_EDGE_OVERFLOW_PX = 5
const MIN_TOP_PX = 8
const OUT_OF_VIEWPORT_Y = -50

const getPortaledTooltip = () =>
  screen.getByText('Throughput').closest<HTMLDivElement>(TOOLTIP_SELECTOR)

describe('UnifiedTooltip', () => {
  it('renders every metric label and its formatted value in a portal on document.body', () => {
    render(<UnifiedTooltip {...defaultProps} />)

    expect(screen.getByText('Throughput').closest('body')).toBe(document.body)
    expect(screen.getByText('Throughput')).toBeInTheDocument()
    expect(screen.getByText('100 u')).toBeInTheDocument()
    expect(screen.getByText('IOPS')).toBeInTheDocument()
    expect(screen.getByText('500 u')).toBeInTheDocument()
    expect(screen.getByText('Avg. Latency')).toBeInTheDocument()
    expect(screen.getByText('1 u')).toBeInTheDocument()
  })

  it('renders the datetime icon', () => {
    render(<UnifiedTooltip {...defaultProps} />)
    expect(document.body.querySelector('svg')).toBeInTheDocument()
  })

  it('positions the portaled tooltip near the cursor via CSS custom properties', () => {
    render(<UnifiedTooltip {...defaultProps} />)

    const tooltip = getPortaledTooltip()
    expect(tooltip?.style.getPropertyValue('--tooltip-left')).toBe(
      `${defaultProps.viewportX + TOOLTIP_OFFSET_PX}px`
    )
    expect(tooltip?.style.getPropertyValue('--tooltip-top')).toBe(
      `${defaultProps.viewportY + TOOLTIP_OFFSET_PX}px`
    )
  })

  it('flips to the left of the cursor when the tooltip would overflow the right edge', () => {
    const overflowingViewportX = window.innerWidth - RIGHT_EDGE_OVERFLOW_PX

    render(
      <UnifiedTooltip
        {...defaultProps}
        viewportX={overflowingViewportX}
      />
    )

    const tooltip = getPortaledTooltip()
    expect(tooltip?.style.getPropertyValue('--tooltip-left')).toBe(
      `${overflowingViewportX - TOOLTIP_OFFSET_PX - TOOLTIP_WIDTH_PX}px`
    )
  })

  it('clamps the top position so the tooltip never renders above the viewport', () => {
    render(
      <UnifiedTooltip
        {...defaultProps}
        viewportY={OUT_OF_VIEWPORT_Y}
      />
    )

    const tooltip = getPortaledTooltip()
    expect(tooltip?.style.getPropertyValue('--tooltip-top')).toBe(`${MIN_TOP_PX}px`)
  })

  it('falls back to the recharts label when no point carries a timestamp', () => {
    render(
      <UnifiedTooltip
        {...defaultProps}
        metrics={[
          buildMetric('Throughput', 'var(--cyan-500)', [
            { time: '12:00:00', value: 100 }
          ])
        ]}
      />
    )

    expect(screen.getByText('12:00:00')).toBeInTheDocument()
  })

  it('returns null when dataIndex is negative', () => {
    const { container } = render(
      <UnifiedTooltip
        {...defaultProps}
        dataIndex={-1}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('defaults a missing point value to 0', () => {
    render(
      <UnifiedTooltip
        {...defaultProps}
        dataIndex={5}
      />
    )
    expect(screen.getAllByText('0 u')).toHaveLength(defaultProps.metrics.length)
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { BarChartTick } from './BarChartTick'

const TOOLTIP_ID = 'chart-tick-tooltip'
const LONG_LABEL = 'a-very-long-bucket-name'
const TRUNCATED_LABEL = 'a-very-lon...'
const SHORT_LABEL = 'bucket-1'

const renderTick = (value: string) =>
  render(
    <svg>
      <BarChartTick
        payload={{ value }}
        x={0}
        y={0}
      />
    </svg>
  )

describe('BarChartTick', () => {
  afterEach(() => {
    document.getElementById(TOOLTIP_ID)?.remove()
  })

  it('renders short labels untruncated', () => {
    renderTick(SHORT_LABEL)

    expect(screen.getByText(SHORT_LABEL)).toBeInTheDocument()
  })

  it('truncates labels longer than 13 characters', () => {
    renderTick(LONG_LABEL)

    expect(screen.getByText(TRUNCATED_LABEL)).toBeInTheDocument()
  })

  it('shows a tooltip with the full label on hover when truncated', () => {
    renderTick(LONG_LABEL)

    fireEvent.mouseEnter(screen.getByText(TRUNCATED_LABEL))

    const tooltip = document.getElementById(TOOLTIP_ID)
    expect(tooltip).toHaveTextContent(LONG_LABEL)
    expect(tooltip?.style.opacity).toBe('1')
  })

  it('hides the tooltip on mouse leave', () => {
    renderTick(LONG_LABEL)
    fireEvent.mouseEnter(screen.getByText(TRUNCATED_LABEL))

    fireEvent.mouseLeave(screen.getByText(TRUNCATED_LABEL))

    expect(document.getElementById(TOOLTIP_ID)?.style.opacity).toBe('0')
  })

  it('does not show a tooltip for labels that fit', () => {
    renderTick(SHORT_LABEL)

    fireEvent.mouseEnter(screen.getByText(SHORT_LABEL))

    expect(document.getElementById(TOOLTIP_ID)).toBeNull()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SERIES_TYPES, type SeriesConfig } from '../chartTypes'
import { CustomLegend } from './CustomLegend'

const SHOW_ALL_LABEL = 'Show All'
const HIDE_ALL_LABEL = 'Hide All'

const SERIES: SeriesConfig[] = [
  {
    key: 'read',
    name: 'Read',
    color: 'var(--blue-500)',
    type: SERIES_TYPES.LINE
  },
  {
    key: 'write',
    name: 'Write',
    color: 'var(--aqua-500)',
    type: SERIES_TYPES.AREA
  }
]

describe('CustomLegend', () => {
  it('renders a legend item per series', () => {
    render(<CustomLegend series={SERIES} />)

    expect(screen.getByRole('button', { name: 'Read' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Write' })).toBeInTheDocument()
  })

  it('toggles a metric when its legend item is clicked', () => {
    const toggleMetric = vi.fn()

    render(
      <CustomLegend
        series={SERIES}
        toggleMetric={toggleMetric}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Read' }))

    expect(toggleMetric).toHaveBeenCalledWith('read')
  })

  it('marks hidden metrics with the hidden class', () => {
    render(
      <CustomLegend
        hiddenMetrics={new Set(['write'])}
        series={SERIES}
      />
    )

    expect(screen.getByRole('button', { name: 'Write' })).toHaveClass('hidden')
    expect(screen.getByRole('button', { name: 'Read' })).not.toHaveClass(
      'hidden'
    )
  })

  it('does not render the action buttons by default', () => {
    render(<CustomLegend series={SERIES} />)

    expect(
      screen.queryByRole('button', { name: SHOW_ALL_LABEL })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: HIDE_ALL_LABEL })
    ).not.toBeInTheDocument()
  })

  it('calls onShowAll when the enabled Show All button is clicked', () => {
    const onShowAll = vi.fn()

    render(
      <CustomLegend
        onShowAll={onShowAll}
        series={SERIES}
        shouldShowAllBtn
      />
    )
    fireEvent.click(screen.getByRole('button', { name: SHOW_ALL_LABEL }))

    expect(onShowAll).toHaveBeenCalledTimes(1)
  })

  it('calls onHideAll when the enabled Hide All button is clicked', () => {
    const onHideAll = vi.fn()

    render(
      <CustomLegend
        onHideAll={onHideAll}
        series={SERIES}
        shouldHideAllBtn
      />
    )
    fireEvent.click(screen.getByRole('button', { name: HIDE_ALL_LABEL }))

    expect(onHideAll).toHaveBeenCalledTimes(1)
  })
})

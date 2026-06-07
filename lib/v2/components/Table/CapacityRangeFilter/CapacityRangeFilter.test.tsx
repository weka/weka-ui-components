import type { CapacityUnit } from './capacityRangeFilterTypes'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CapacityRangeFilter } from './CapacityRangeFilter'
import { CAPACITY_RANGE_MODES } from './capacityRangeFilterTypes'

const GB = 1_000_000_000
const TB = 1_000_000_000_000

const UNIT_OPTIONS: CapacityUnit[] = [
  { label: 'GB', value: GB },
  { label: 'TB', value: TB }
]

describe('CapacityRangeFilter', () => {
  it('renders the Used/Total mode toggle and min/max inputs', () => {
    render(<CapacityRangeFilter unitOptions={UNIT_OPTIONS} />)
    expect(screen.getByTestId('capacity-filter-used-tab')).toBeInTheDocument()
    expect(screen.getByTestId('capacity-filter-total-tab')).toBeInTheDocument()
    expect(screen.getByTestId('capacity-range-min-input')).toBeInTheDocument()
    expect(screen.getByTestId('capacity-range-max-input')).toBeInTheDocument()
  })

  it('emits the new mode when switching to Total', () => {
    const onChange = vi.fn()
    render(
      <CapacityRangeFilter
        onChange={onChange}
        unitOptions={UNIT_OPTIONS}
      />
    )
    fireEvent.click(screen.getByTestId('capacity-filter-total-tab'))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ mode: CAPACITY_RANGE_MODES.TOTAL })
    )
  })

  it('shows custom mode labels when provided', () => {
    render(
      <CapacityRangeFilter
        modeLabels={{ used: 'Consumed', total: 'Capacity' }}
        unitOptions={UNIT_OPTIONS}
      />
    )
    expect(screen.getByText('Consumed')).toBeInTheDocument()
    expect(screen.getByText('Capacity')).toBeInTheDocument()
  })
})

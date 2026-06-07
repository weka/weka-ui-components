import type { CapacityUnit } from '../CapacityRangeFilter/capacityRangeFilterTypes'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ReductionRangeFilter } from './ReductionRangeFilter'
import { REDUCTION_RANGE_MODES } from './reductionRangeFilterTypes'

const GB = 1_000_000_000

const UNIT_OPTIONS: CapacityUnit[] = [{ label: 'GB', value: GB }]

describe('ReductionRangeFilter', () => {
  it('renders the Ratio/Reduced Size toggle, defaulting to Ratio', () => {
    render(<ReductionRangeFilter unitOptions={UNIT_OPTIONS} />)
    expect(screen.getByTestId('reduction-filter-ratio-tab')).toBeInTheDocument()
    expect(screen.getByTestId('reduction-filter-size-tab')).toBeInTheDocument()
    expect(screen.getByTestId('number-range-min-input')).toBeInTheDocument()
  })

  it('switches to the capacity range when Reduced Size is selected', () => {
    const onChange = vi.fn()
    render(
      <ReductionRangeFilter
        onChange={onChange}
        unitOptions={UNIT_OPTIONS}
      />
    )
    fireEvent.click(screen.getByTestId('reduction-filter-size-tab'))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ mode: REDUCTION_RANGE_MODES.REDUCED_SIZE })
    )
    expect(screen.getByTestId('capacity-range-min-input')).toBeInTheDocument()
  })
})

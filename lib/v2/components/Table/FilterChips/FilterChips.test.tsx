import type { CustomFilters } from '../FilterPopover'
import type { ActiveFilter } from '../filterUtils'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import { FilterChips } from './FilterChips'

function renderChips(activeFilters: ActiveFilter[], overrides = {}) {
  const props = {
    activeFilters,
    onRemoveFilter: vi.fn(),
    onClearAllFilters: vi.fn(),
    ...overrides
  }
  render(<FilterChips {...props} />)
  return props
}

afterEach(() => {
  cleanup()
})

describe('FilterChips', () => {
  it('renders nothing when there are no active filters', () => {
    const { container } = render(
      <FilterChips
        activeFilters={[]}
        onClearAllFilters={vi.fn()}
        onRemoveFilter={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders a chip with the multiselect value', () => {
    renderChips([
      {
        columnId: 'region',
        type: FILTER_TYPES.MULTISELECT,
        value: ['us-east-1'],
        label: 'Region'
      }
    ])
    expect(screen.getByTestId('filter-chip-region')).toBeInTheDocument()
    expect(screen.getByText('us-east-1')).toBeInTheDocument()
  })

  it('formats a numeric range chip, using Any for an open bound', () => {
    renderChips([
      {
        columnId: 'size',
        type: FILTER_TYPES.NUM_RANGE,
        value: { min: 5, max: null },
        label: 'Size'
      }
    ])
    expect(screen.getByText('5 - Any')).toBeInTheDocument()
  })

  it('uses the registry formatChip for a custom filter type', () => {
    const customFilters: CustomFilters = {
      [FILTER_TYPES.CAPACITY_RANGE]: {
        getDefaultValue: () => ({}),
        render: () => null,
        isEmpty: () => false,
        formatChip: () => ({ label: 'Capacity (Used)', display: '10 GB - Any' })
      }
    }
    renderChips(
      [
        {
          columnId: 'capacity',
          type: FILTER_TYPES.CAPACITY_RANGE,
          value: { mode: 'used' },
          label: 'Capacity'
        }
      ],
      { customFilters }
    )
    expect(screen.getByText('Capacity (Used):')).toBeInTheDocument()
    expect(screen.getByText('10 GB - Any')).toBeInTheDocument()
  })

  it('calls onRemoveFilter and onClearAllFilters', () => {
    const { onRemoveFilter, onClearAllFilters } = renderChips([
      {
        columnId: 'region',
        type: FILTER_TYPES.MULTISELECT,
        value: ['us-east-1'],
        label: 'Region'
      }
    ])
    fireEvent.click(screen.getByTitle('Remove Region filter'))
    expect(onRemoveFilter).toHaveBeenCalledWith('region')
    fireEvent.click(screen.getByTestId('clear-all-filters-button'))
    expect(onClearAllFilters).toHaveBeenCalled()
  })
})

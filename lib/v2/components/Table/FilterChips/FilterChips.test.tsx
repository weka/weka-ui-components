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

  it('renders the option label, not the raw value, for a dropdown chip', () => {
    renderChips(
      [
        {
          columnId: 'enforce_fs_auth',
          type: FILTER_TYPES.DROPDOWN,
          value: 'true',
          label: 'FS Auth'
        }
      ],
      {
        columns: [
          {
            accessorKey: 'enforce_fs_auth',
            meta: {
              filter: {
                type: FILTER_TYPES.DROPDOWN,
                options: [
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' }
                ]
              }
            }
          }
        ]
      }
    )
    const chip = screen.getByTestId('filter-chip-enforce_fs_auth')
    expect(chip).toHaveTextContent('Yes')
    expect(chip).not.toHaveTextContent('true')
  })

  it('falls back to the raw value for a dropdown column without options', () => {
    renderChips([
      {
        columnId: 'status',
        type: FILTER_TYPES.DROPDOWN,
        value: 'active',
        label: 'Status'
      }
    ])
    expect(screen.getByTestId('filter-chip-status')).toHaveTextContent('active')
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

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import { TableFilter } from './TableFilter'

const COLUMN_ID = 'region'
const COLUMNS = [
  {
    accessorKey: COLUMN_ID,
    header: 'Region',
    meta: { filter: { type: FILTER_TYPES.MULTISELECT, options: ['us-east-1'] } }
  }
]

function renderTableFilter(overrides = {}) {
  const props = {
    columnId: COLUMN_ID,
    columns: COLUMNS,
    activeFilters: [],
    onFilterChange: vi.fn(),
    canFilter: true,
    canSort: true,
    onSortClick: vi.fn(),
    ...overrides
  }
  render(<TableFilter {...props} />)
  return props
}

afterEach(() => {
  cleanup()
})

describe('TableFilter', () => {
  it('renders filter and sort buttons when enabled', () => {
    renderTableFilter()
    expect(
      screen.getByTestId(`column-filter-button-${COLUMN_ID}`)
    ).toBeInTheDocument()
    expect(
      screen.getByTestId(`column-sort-button-${COLUMN_ID}`)
    ).toBeInTheDocument()
  })

  it('hides the filter button when canFilter is false', () => {
    renderTableFilter({ canFilter: false })
    expect(
      screen.queryByTestId(`column-filter-button-${COLUMN_ID}`)
    ).not.toBeInTheDocument()
  })

  it('opens the filter popover with the column config on click', () => {
    renderTableFilter()
    fireEvent.click(screen.getByTestId(`column-filter-button-${COLUMN_ID}`))
    expect(screen.getByTestId('filter-popover')).toBeInTheDocument()
    expect(screen.getByTestId('filter-option-us-east-1')).toBeInTheDocument()
  })

  it('calls onSortClick when the sort button is clicked', () => {
    const { onSortClick } = renderTableFilter()
    fireEvent.click(screen.getByTestId(`column-sort-button-${COLUMN_ID}`))
    expect(onSortClick).toHaveBeenCalled()
  })
})

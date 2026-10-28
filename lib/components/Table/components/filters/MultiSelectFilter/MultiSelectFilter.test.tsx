import type { ExtendedFilterProps } from '../../../types'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import MultiSelectFilter, {
  type MultiSelectFilterOptions
} from './MultiSelectFilter'

type Props = ExtendedFilterProps<unknown, string[], MultiSelectFilterOptions>

const FIXED_OPTIONS = ['High', 'Medium', 'Low']
const NO_OPTIONS_TEXT = 'No options'
const MENU_SIZE = 300

const emptyTable = {
  getRowModel: () => ({ rows: [] })
} as unknown as Props['table']

const columnWith = (filterValue?: string[]) =>
  ({
    columnDef: { header: 'Confidence', meta: {} },
    getFilterValue: () => filterValue,
    setFilterValue: vi.fn(),
    getFacetedUniqueValues: () => new Map()
  }) as unknown as Props['column']

const renderOnEmptyPage = (
  filterOptions: MultiSelectFilterOptions,
  filterValue?: string[]
) => {
  render(
    <MultiSelectFilter
      column={columnWith(filterValue)}
      filterOptions={filterOptions}
      table={emptyTable}
    />
  )
  fireEvent.click(
    document.querySelector('.filter-table-wrapper-icon') as Element
  )
}

const search = (query: string) => {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: query } })
}

beforeEach(() => {
  cleanup()
  // The virtualised menu renders nothing unless its scroll container reports a
  // non-zero offset size, which happy-dom never does.
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(
    MENU_SIZE
  )
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(
    MENU_SIZE
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MultiSelectFilter on a page its own filter emptied', () => {
  it('still offers the fixed options that are not chosen yet', () => {
    renderOnEmptyPage(
      { fixedOptions: FIXED_OPTIONS, advancedFiltering: false },
      ['Low']
    )

    search('i')

    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.queryByText(NO_OPTIONS_TEXT)).not.toBeInTheDocument()
  })

  it('offers nothing when the options come from the rows', () => {
    renderOnEmptyPage({ advancedFiltering: false })

    search('i')

    expect(screen.getByText(NO_OPTIONS_TEXT)).toBeInTheDocument()
  })
})

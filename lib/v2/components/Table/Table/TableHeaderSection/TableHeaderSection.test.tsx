import type { ActiveFilter } from '../../filterUtils'
import type { ColumnDef, TableOptions } from '@tanstack/react-table'

import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import { TableHeaderSection } from './TableHeaderSection'

interface Item {
  id: number
  name: string
}

const COLUMNS: ColumnDef<Item>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' }
]
const DATA: Item[] = [{ id: 1, name: 'Alpha' }]

const ACTIVE_FILTER: ActiveFilter = {
  columnId: 'name',
  label: 'Name',
  type: FILTER_TYPES.MULTISELECT,
  value: ['Alpha']
}

function renderSection(overrides: Record<string, unknown> = {}) {
  function Harness() {
    const table = useReactTable({
      data: DATA,
      columns: COLUMNS,
      getCoreRowModel: getCoreRowModel()
    } as TableOptions<Item>)

    return (
      <TableHeaderSection
        activeFilters={[]}
        actualFilteredCount={1}
        columns={COLUMNS}
        data={DATA}
        onClearAllFilters={vi.fn()}
        onFilterChange={vi.fn()}
        onGlobalSearch={vi.fn()}
        onRemoveFilter={vi.fn()}
        onResetColumnSizing={vi.fn()}
        showFilterChips={false}
        showSearch={false}
        table={table}
        useTableHeader={false}
        {...overrides}
      />
    )
  }

  return render(<Harness />)
}

describe('TableHeaderSection', () => {
  it('renders nothing when the table header is off and no title is given', () => {
    const { container } = renderSection()
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a plain title row with the filtered count when given a title', () => {
    renderSection({ title: 'Buckets', actualFilteredCount: 1 })
    expect(screen.getByText('Buckets')).toBeInTheDocument()
    expect(screen.getByText('(1)')).toBeInTheDocument()
  })

  it('renders the full TableHeader when useTableHeader is true', () => {
    renderSection({ useTableHeader: true, title: 'Buckets' })
    expect(screen.getByTestId('table-header-title')).toHaveTextContent(
      'Buckets'
    )
  })

  it('renders filter chips when chips are enabled and filters are active', () => {
    renderSection({
      title: 'Buckets',
      showFilterChips: true,
      activeFilters: [ACTIVE_FILTER]
    })
    expect(screen.getByTestId('clear-all-filters-button')).toBeInTheDocument()
  })
})

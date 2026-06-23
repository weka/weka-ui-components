import type { RowAction } from './rowActions'
import type { ColumnDef } from '@tanstack/react-table'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import { Table } from './Table'

interface Item {
  id: number
  name: string
}

const COLUMNS: ColumnDef<Item>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' }
]

const DATA: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]

const FILTERABLE_COLUMNS: ColumnDef<Item>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    filterFn: (row, columnId, value: string[]) =>
      value.includes(row.getValue(columnId))
  }
]

const RESIZER_ID_TESTID = 'column-resizer-id'
const RESIZER_NAME_TESTID = 'column-resizer-name'
const ROW_ACTIONS_BUTTON_TESTID = 'row-actions-button'

describe('Table', () => {
  describe('baseline functionality', () => {
    it('renders rows and headers with minimal props', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
        />
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('renders the empty message when there is no data', () => {
      render(
        <Table
          columns={COLUMNS}
          data={[]}
          emptyMessage='No items found'
        />
      )
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })

    it('renders the loading state', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          loading
        />
      )
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('row click handler', () => {
    it('calls onRowClick with the clicked row data', () => {
      const onRowClick = vi.fn()
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onRowClick={onRowClick}
        />
      )
      screen.getByText('Item 1').closest('tr')?.click()
      expect(onRowClick).toHaveBeenCalledWith(DATA[0])
    })
  })

  describe('table header', () => {
    it('renders the title when provided', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          title='Test Table'
        />
      )
      expect(screen.getByText('Test Table')).toBeInTheDocument()
    })

    it('renders no header controls when useTableHeader is false and there is no title', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          useTableHeader={false}
        />
      )
      expect(
        screen.queryByTestId('table-settings-button')
      ).not.toBeInTheDocument()
    })
  })

  describe('column resizing', () => {
    it('renders resize handles when hasResizableColumns is true', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          hasResizableColumns
        />
      )
      expect(screen.queryByTestId(RESIZER_ID_TESTID)).toBeInTheDocument()
      expect(screen.queryByTestId(RESIZER_NAME_TESTID)).toBeInTheDocument()
    })

    it('renders no resize handles when hasResizableColumns is false', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          hasResizableColumns={false}
        />
      )
      expect(screen.queryByTestId(RESIZER_ID_TESTID)).not.toBeInTheDocument()
      expect(screen.queryByTestId(RESIZER_NAME_TESTID)).not.toBeInTheDocument()
    })

    it('honors per-column enableResizing', () => {
      const columns: ColumnDef<Item>[] = [
        { id: 'id', accessorKey: 'id', header: 'ID', enableResizing: false },
        {
          id: 'name',
          accessorKey: 'name',
          header: 'Name',
          enableResizing: true
        }
      ]
      render(
        <Table
          columns={columns}
          data={DATA}
          hasResizableColumns
        />
      )
      expect(screen.queryByTestId(RESIZER_ID_TESTID)).not.toBeInTheDocument()
      expect(screen.queryByTestId(RESIZER_NAME_TESTID)).toBeInTheDocument()
    })

    it('synchronizes header and body cell widths', async () => {
      const { container } = render(
        <Table
          columns={COLUMNS}
          data={DATA}
          hasResizableColumns
        />
      )

      await waitFor(() => {
        const headerRow = container.querySelector('thead tr')
        const bodyRows = container.querySelectorAll('tbody tr')
        expect(headerRow).toBeTruthy()
        expect(bodyRows.length).toBeGreaterThan(0)

        const headerCells = Array.from(headerRow?.querySelectorAll('th') ?? [])
        const bodyCells = Array.from(bodyRows[0].querySelectorAll('td'))
        expect(headerCells.length).toBe(bodyCells.length)

        headerCells.forEach((headerCell, index) => {
          const headerWidth = headerCell
            .getAttribute('style')
            ?.match(/width:\s*(\d+(?:\.\d+)?px)/)?.[1]
          const bodyWidth = bodyCells[index]
            .getAttribute('style')
            ?.match(/width:\s*(\d+(?:\.\d+)?px)/)?.[1]
          expect(headerWidth).toBeTruthy()
          expect(headerWidth).toBe(bodyWidth)
        })
      })
    })
  })
})

describe('Table rowActions', () => {
  const ROW_ACTIONS: RowAction<Item>[] = [
    {
      key: 'edit',
      text: 'Edit',
      action: vi.fn()
    },
    {
      key: 'delete',
      text: 'Delete',
      action: vi.fn()
    },
    {
      key: 'hidden-action',
      text: 'Hidden',
      action: vi.fn(),
      hideAction: () => true
    },
    {
      key: 'disabled-action',
      text: 'Disabled',
      action: vi.fn(),
      disabled: () => true
    }
  ]

  it('renders a row actions button for each row', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
      />
    )
    const buttons = screen.getAllByTestId(ROW_ACTIONS_BUTTON_TESTID)
    expect(buttons).toHaveLength(DATA.length)
  })

  it('opens the actions menu and shows visible actions', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
      />
    )
    const [firstButton] = screen.getAllByTestId(ROW_ACTIONS_BUTTON_TESTID)
    fireEvent.click(firstButton)
    expect(screen.getByTestId('row-action-edit')).toBeInTheDocument()
    expect(screen.getByTestId('row-action-delete')).toBeInTheDocument()
  })

  it('does not render hidden actions', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
      />
    )
    const [firstButton] = screen.getAllByTestId(ROW_ACTIONS_BUTTON_TESTID)
    fireEvent.click(firstButton)
    expect(screen.queryByTestId('row-action-hidden-action')).not.toBeInTheDocument()
  })

  it('renders disabled actions as disabled', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
      />
    )
    const [firstButton] = screen.getAllByTestId(ROW_ACTIONS_BUTTON_TESTID)
    fireEvent.click(firstButton)
    expect(screen.getByTestId('row-action-disabled-action')).toBeDisabled()
  })

  it('calls the action callback when a menu item is clicked', () => {
    const editAction = vi.fn()
    const actions: RowAction<Item>[] = [
      { key: 'edit', text: 'Edit', action: editAction }
    ]
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={actions}
      />
    )
    const [firstButton] = screen.getAllByTestId(ROW_ACTIONS_BUTTON_TESTID)
    fireEvent.click(firstButton)
    fireEvent.click(screen.getByTestId('row-action-edit'))
    expect(editAction).toHaveBeenCalledWith(DATA[0])
  })

  it('renders no kebab button when all actions are hidden for a row', () => {
    const actions: RowAction<Item>[] = [
      { key: 'always-hidden', text: 'Hidden', action: vi.fn(), hideAction: () => true }
    ]
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={actions}
      />
    )
    expect(screen.queryByTestId(ROW_ACTIONS_BUTTON_TESTID)).not.toBeInTheDocument()
  })
})

describe('Table controlled filters', () => {
  describe('controlled filters', () => {
    it('reflects the active-filter count in the header', () => {
      render(
        <Table
          columns={COLUMNS}
          data={DATA}
          onFiltersChange={vi.fn()}
          title='Items'
          activeFilters={[
            {
              columnId: 'name',
              type: FILTER_TYPES.MULTISELECT,
              value: ['Item 1'],
              label: 'Name'
            }
          ]}
        />
      )
      expect(screen.getByTestId('filter-chip-name')).toBeInTheDocument()
    })

    it('filters rows to match the controlled activeFilters', async () => {
      render(
        <Table
          columns={FILTERABLE_COLUMNS}
          data={DATA}
          onFiltersChange={vi.fn()}
          activeFilters={[
            {
              columnId: 'name',
              type: FILTER_TYPES.MULTISELECT,
              value: ['Item 1'],
              label: 'Name'
            }
          ]}
        />
      )
      await waitFor(() => {
        expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
      })
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
      expect(screen.getByTestId('column-header-name')).toBeInTheDocument()
    })

    it('reports the filtered rows (not stale data) via onFilteredDataChange', async () => {
      const onFilteredDataChange = vi.fn()
      render(
        <Table
          columns={FILTERABLE_COLUMNS}
          data={DATA}
          onFilteredDataChange={onFilteredDataChange}
          onFiltersChange={vi.fn()}
          activeFilters={[
            {
              columnId: 'name',
              type: FILTER_TYPES.MULTISELECT,
              value: ['Item 1'],
              label: 'Name'
            }
          ]}
        />
      )
      await waitFor(() => {
        const lastCall = onFilteredDataChange.mock.lastCall?.[0] as Item[]
        expect(lastCall).toEqual([{ id: 1, name: 'Item 1' }])
      })
    })
  })
})

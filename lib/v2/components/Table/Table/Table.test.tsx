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
    expect(
      screen.queryByTestId('row-action-hidden-action')
    ).not.toBeInTheDocument()
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
      {
        key: 'always-hidden',
        text: 'Hidden',
        action: vi.fn(),
        hideAction: () => true
      }
    ]
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={actions}
      />
    )
    expect(
      screen.queryByTestId(ROW_ACTIONS_BUTTON_TESTID)
    ).not.toBeInTheDocument()
  })

  it('applies stickyActions class to the actions header cell and body cells', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
      />
    )

    // The last <th> in the header row should have the stickyActions class
    const headerRow = container.querySelector('thead tr')
    const headerCells = Array.from(headerRow?.querySelectorAll('th') ?? [])
    const lastHeaderCell = headerCells.at(-1)
    expect(lastHeaderCell).toHaveClass('stickyActions')

    // Every last <td> in each body row should have the stickyActions class
    const bodyRows = container.querySelectorAll('tbody tr')
    bodyRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'))
      const lastCell = cells.at(-1)
      expect(lastCell).toHaveClass('stickyActions')
    })
  })

  it('does not apply stickyActions class when rowActions are not provided', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
      />
    )

    // No cell should have the stickyActions class
    const stickyCells = container.querySelectorAll('.stickyActions')
    expect(stickyCells).toHaveLength(0)
  })
})

describe('Table pinFirstColumn', () => {
  it('applies stickyFirst class to first header cell and first body cells when pinFirstColumn is true', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        pinFirstColumn
      />
    )

    // The first <th> in the header row should have the stickyFirst class
    const headerRow = container.querySelector('thead tr')
    const headerCells = Array.from(headerRow?.querySelectorAll('th') ?? [])
    const firstHeaderCell = headerCells.at(0)
    expect(firstHeaderCell).toHaveClass('stickyFirst')

    // The second <th> should NOT have stickyFirst
    const secondHeaderCell = headerCells.at(1)
    expect(secondHeaderCell).not.toHaveClass('stickyFirst')

    // Every first <td> in each body row should have the stickyFirst class
    const bodyRows = container.querySelectorAll('tbody tr')
    bodyRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'))
      const firstCell = cells.at(0)
      expect(firstCell).toHaveClass('stickyFirst')
      // Last cell should NOT have stickyFirst
      const lastCell = cells.at(-1)
      expect(lastCell).not.toHaveClass('stickyFirst')
    })
  })

  it('does not apply stickyFirst class when pinFirstColumn is false', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
      />
    )

    const stickyCells = container.querySelectorAll('.stickyFirst')
    expect(stickyCells).toHaveLength(0)
  })

  it('applies both stickyFirst and stickyActions when pinFirstColumn is true and rowActions are provided', () => {
    const ROW_ACTIONS: RowAction<Item>[] = [
      { key: 'edit', text: 'Edit', action: vi.fn() }
    ]
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        pinFirstColumn
        rowActions={ROW_ACTIONS}
      />
    )

    const headerRow = container.querySelector('thead tr')
    const headerCells = Array.from(headerRow?.querySelectorAll('th') ?? [])

    // First header cell gets stickyFirst
    expect(headerCells.at(0)).toHaveClass('stickyFirst')
    // Last header cell (actions) gets stickyActions
    expect(headerCells.at(-1)).toHaveClass('stickyActions')

    // Verify body rows have both classes
    const bodyRows = container.querySelectorAll('tbody tr')
    bodyRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'))
      expect(cells.at(0)).toHaveClass('stickyFirst')
      expect(cells.at(-1)).toHaveClass('stickyActions')
    })
  })
})

describe('Table drawer slot', () => {
  const DRAWER_TESTID = 'my-drawer'
  const TABLE_BODY_AREA_SELECTOR = '.tableBodyArea'
  const TABLE_BODY_MAIN_SELECTOR = '.tableBodyMain'
  const TABLE_FOOTER_SELECTOR = '.tableFooter'

  it('renders the drawer node when drawer prop is provided', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        drawer={<div data-testid={DRAWER_TESTID}>Drawer content</div>}
      />
    )
    expect(screen.getByTestId(DRAWER_TESTID)).toBeInTheDocument()
  })

  it('does not render a tableBodyArea wrapper when drawer is absent', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
      />
    )
    expect(
      container.querySelector(TABLE_BODY_AREA_SELECTOR)
    ).not.toBeInTheDocument()
  })

  it('applies margin-right to tableBodyMain when drawerOpen is true', () => {
    const DRAWER_WIDTH = 320
    const EXPECTED_GAP = 24
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        drawer={<div data-testid={DRAWER_TESTID}>Drawer</div>}
        drawerOpen
        drawerWidth={DRAWER_WIDTH}
      />
    )
    const tableBodyArea = container.querySelector(TABLE_BODY_AREA_SELECTOR)
    expect(tableBodyArea).toBeInTheDocument()
    const tableBodyMain = tableBodyArea?.querySelector(TABLE_BODY_MAIN_SELECTOR)
    expect(tableBodyMain).toHaveStyle({
      marginRight: `${DRAWER_WIDTH + EXPECTED_GAP}px`
    })
  })

  it('applies no margin-right when drawerOpen is false', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        drawer={<div data-testid={DRAWER_TESTID}>Drawer</div>}
        drawerOpen={false}
        drawerWidth={320}
      />
    )
    const tableBodyArea = container.querySelector(TABLE_BODY_AREA_SELECTOR)
    const tableBodyMain = tableBodyArea?.querySelector(TABLE_BODY_MAIN_SELECTOR)
    expect(tableBodyMain).toHaveStyle({ marginRight: '0px' })
  })

  it('renders the footer inside tableBodyMain when drawer is present', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        drawer={<div data-testid={DRAWER_TESTID}>Drawer</div>}
        drawerOpen
        drawerWidth={320}
      />
    )
    const tableBodyMain = container.querySelector(TABLE_BODY_MAIN_SELECTOR)
    expect(
      tableBodyMain?.querySelector(TABLE_FOOTER_SELECTOR)
    ).toBeInTheDocument()
  })

  it('still renders table rows when drawer is present', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        drawer={<div data-testid={DRAWER_TESTID}>Drawer</div>}
        drawerOpen
        drawerWidth={320}
      />
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
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

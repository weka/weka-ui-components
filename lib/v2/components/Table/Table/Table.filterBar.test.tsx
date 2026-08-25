import type { ColumnDef } from '@tanstack/react-table'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Table } from './Table'

interface Item {
  id: number
  name: string
}

const COLUMNS: ColumnDef<Item>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' }
]

const DATA: Item[] = [{ id: 1, name: 'Item 1' }]

describe('Table filterBar', () => {
  it('renders nothing extra when filterBar is not provided', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
      />
    )

    expect(container.querySelector('[class*="filterBarRow"]')).toBeNull()
  })

  it('renders the consumer-provided filterBar inside the table header area', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        filterBar={<div data-testid='custom-filter-bar'>Custom filters</div>}
      />
    )

    expect(screen.getByTestId('custom-filter-bar')).toBeInTheDocument()
  })

  it('renders filterBar alongside the default table header (useTableHeader defaults true)', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        filterBar={<div data-testid='custom-filter-bar' />}
        title='Items'
      />
    )

    expect(screen.getByText('Items')).toBeInTheDocument()
    expect(screen.getByTestId('custom-filter-bar')).toBeInTheDocument()
  })

  it('suppresses the grid top border/radius so it continues from filterBar instead', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        filterBar={<div data-testid='custom-filter-bar' />}
      />
    )

    expect(
      container.querySelector('[class*="tableContainerAfterFilterBar"]')
    ).not.toBeNull()
  })

  it('keeps the grid top border/radius when there is no filterBar', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
      />
    )

    expect(
      container.querySelector('[class*="tableContainerAfterFilterBar"]')
    ).toBeNull()
  })
})

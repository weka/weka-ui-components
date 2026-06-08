import type { ColumnDef, TableOptions } from '@tanstack/react-table'

import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TableContent } from './TableContent'

interface Row {
  id: number
  name: string
}

const COLUMNS: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }]

const DATA: Row[] = [
  { id: 1, name: 'alpha' },
  { id: 2, name: 'beta' }
]

interface HarnessProps {
  data?: Row[]
  onRowClick?: (row: Row) => void
  activeRowId?: number
}

function Harness({
  data = DATA,
  onRowClick,
  activeRowId
}: Readonly<HarnessProps>) {
  const table = useReactTable<Row>({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel()
  } as TableOptions<Row>)

  return (
    <table>
      <tbody>
        <TableContent
          activeRowId={activeRowId}
          emptyMessage='Nothing here'
          getRowId={(row) => row.id}
          onRowClick={onRowClick}
          rows={table.getRowModel().rows}
        />
      </tbody>
    </table>
  )
}

describe('TableContent', () => {
  it('renders the empty message when there are no rows', () => {
    render(<Harness data={[]} />)
    expect(screen.getByTestId('table-empty-message')).toHaveTextContent(
      'Nothing here'
    )
  })

  it('renders a row per data item', () => {
    render(<Harness />)
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
  })

  it('calls onRowClick with the original row data', () => {
    const onRowClick = vi.fn()
    render(<Harness onRowClick={onRowClick} />)
    fireEvent.click(screen.getByText('alpha'))
    expect(onRowClick).toHaveBeenCalledWith(DATA[0])
  })

  it('exposes the resolved row id as a data attribute', () => {
    render(<Harness />)
    expect(screen.getByText('beta').closest('tr')).toHaveAttribute(
      'data-row-id',
      '2'
    )
  })
})

import type { ColumnDef, TableOptions } from '@tanstack/react-table'

import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

const CONTAINER_STYLE = {
  padding: '24px',
  background: 'var(--bg-secondary)',
  minHeight: '320px',
  overflow: 'visible' as const
}

const TABLE_STYLE = {
  borderCollapse: 'collapse' as const,
  width: '100%',
  fontFamily: "'IBMPlexSans', sans-serif",
  fontSize: '13px',
  color: 'var(--text-primary)'
}

const HEADER_STYLE = {
  textAlign: 'left' as const,
  padding: '8px 12px',
  borderBottom: '1px solid var(--gray-200-800)',
  fontWeight: 600
}

const CELL_STYLE = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--gray-100-900)'
}

interface CellStoryTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

/**
 * Renders a minimal TanStack table for cell-component stories so each cell
 * story does not duplicate the table scaffolding and styles.
 */
export function CellStoryTable<TData, TValue>({
  columns,
  data
}: Readonly<CellStoryTableProps<TData, TValue>>) {
  const table = useReactTable<TData>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel()
  } as TableOptions<TData>)

  return (
    <div style={CONTAINER_STYLE}>
      <table style={TABLE_STYLE}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ ...HEADER_STYLE, width: header.getSize() }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ ...CELL_STYLE, width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

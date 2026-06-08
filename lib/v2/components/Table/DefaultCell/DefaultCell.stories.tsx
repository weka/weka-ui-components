import type { DefaultCellOptions, DefaultCellValue } from './DefaultCell'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef, TableOptions } from '@tanstack/react-table'

import { MemoryRouter } from 'react-router-dom'
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import { DefaultCell } from './DefaultCell'

const meta: Meta<typeof DefaultCell> = {
  title: 'v2/Table/cells/DefaultCell'
}

export default meta
type Story = StoryObj<typeof DefaultCell>

interface Row {
  id: string
  name: DefaultCellValue
  protocols: DefaultCellValue
  description: DefaultCellValue
  internalLink: DefaultCellValue
  externalLink: DefaultCellValue
}

const SAMPLE_ROWS: Row[] = [
  {
    id: 'cluster-prod-1',
    name: 'cluster-prod-1',
    protocols: ['NFS', 'SMB', 'S3'],
    description:
      'Production cluster running in us-east-1, handling primary workloads and serving as the source of truth for replication.',
    internalLink: 'View details',
    externalLink: 'Open docs'
  },
  {
    id: 'cluster-prod-2',
    name: 'cluster-prod-2',
    protocols: ['NFS'],
    description: 'Secondary production cluster.',
    internalLink: 'View details',
    externalLink: 'Open docs'
  },
  {
    id: 'cluster-empty',
    name: null,
    protocols: [],
    description: undefined,
    internalLink: null,
    externalLink: null
  }
]

const columns: ColumnDef<Row, DefaultCellValue>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: DefaultCell,
    size: 160
  },
  {
    accessorKey: 'protocols',
    header: 'Protocols',
    cell: DefaultCell,
    size: 140
  },
  {
    accessorKey: 'description',
    header: 'Description (long → tooltip on ellipsis)',
    cell: DefaultCell,
    size: 260
  },
  {
    accessorKey: 'internalLink',
    header: 'Internal link',
    cell: DefaultCell,
    size: 140,
    meta: {
      cellOptions: {
        getUrl: (row: Row) => `/clusters/${row.id}`
      } satisfies DefaultCellOptions<Row>
    } as ColumnDef<Row, DefaultCellValue>['meta']
  },
  {
    accessorKey: 'externalLink',
    header: 'External link (new tab)',
    cell: DefaultCell,
    size: 180,
    meta: {
      cellOptions: {
        getUrl: () => 'https://docs.weka.io',
        openInNewTab: true,
        tooltipText: 'Opens in a new tab'
      } satisfies DefaultCellOptions<Row>
    } as ColumnDef<Row, DefaultCellValue>['meta']
  }
]

const CONTAINER_STYLE = {
  padding: '24px',
  background: 'var(--bg-secondary)',
  minHeight: '320px',
  overflow: 'auto'
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

function DefaultCellDemo() {
  const table = useReactTable<Row>({
    columns,
    data: SAMPLE_ROWS,
    getCoreRowModel: getCoreRowModel()
  } as TableOptions<Row>)

  return (
    <MemoryRouter>
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
    </MemoryRouter>
  )
}

export const Interactive: Story = {
  render: () => <DefaultCellDemo />
}

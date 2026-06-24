import type { DefaultCellOptions, DefaultCellValue } from './DefaultCell'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { MemoryRouter } from 'react-router-dom'

import { CellStoryTable } from '../CellStoryTable'
import { DefaultCell } from './DefaultCell'

const meta: Meta<typeof DefaultCell> = {
  title: 'v2/Table/Cells/DefaultCell'
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

export const Interactive: Story = {
  render: () => (
    <MemoryRouter>
      <CellStoryTable
        columns={columns}
        data={SAMPLE_ROWS}
      />
    </MemoryRouter>
  )
}

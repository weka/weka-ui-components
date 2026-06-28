import type { StatusCellOptions } from './StatusCell'
import type { StatusCellValue } from './statusUtils'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { CellStoryTable } from '../CellStoryTable'
import { StatusCell } from './StatusCell'
import { STATUS_VARIANTS } from './statusUtils'

const meta: Meta<typeof StatusCell> = {
  title: 'v2/Table/Cells/StatusCell'
}

export default meta
type Story = StoryObj<typeof StatusCell>

interface Row {
  id: string
  status: StatusCellValue
  customStatus: StatusCellValue
}

const SAMPLE_ROWS: Row[] = [
  { id: 'node-1', status: 'UP', customStatus: 'ONLINE' },
  { id: 'node-2', status: 'CREATING', customStatus: 'SYNCING' },
  { id: 'node-3', status: 'DEGRADED', customStatus: 'PARTIAL' },
  { id: 'node-4', status: 'OFFLINE', customStatus: 'OFFLINE' }
]

const columns: ColumnDef<Row, StatusCellValue>[] = [
  {
    accessorKey: 'status',
    header: 'Status (default classification)',
    cell: StatusCell,
    size: 240
  },
  {
    accessorKey: 'customStatus',
    header: 'Status (custom classify)',
    cell: StatusCell,
    size: 240,
    meta: {
      cellOptions: {
        classify: (s) => {
          if (s === 'ONLINE') {
            return STATUS_VARIANTS.UP
          }
          if (s === 'SYNCING') {
            return STATUS_VARIANTS.WORKING
          }
          if (s === 'PARTIAL') {
            return STATUS_VARIANTS.DEGRADED
          }
          return STATUS_VARIANTS.DOWN
        }
      } satisfies StatusCellOptions
    } as ColumnDef<Row, StatusCellValue>['meta']
  }
]

export const Interactive: Story = {
  render: () => (
    <CellStoryTable
      columns={columns}
      data={SAMPLE_ROWS}
    />
  )
}

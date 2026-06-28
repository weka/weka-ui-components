import type {
  BooleanIconCellOptions,
  BooleanIconCellValue
} from './BooleanIconCell'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { CellStoryTable } from '../CellStoryTable'
import { BooleanIconCell } from './BooleanIconCell'

const meta: Meta<typeof BooleanIconCell> = {
  title: 'v2/Table/Cells/BooleanIconCell'
}

export default meta
type Story = StoryObj<typeof BooleanIconCell>

interface Row {
  id: string
  enabled: BooleanIconCellValue
  verified: BooleanIconCellValue
  active: BooleanIconCellValue
}

const SAMPLE_ROWS: Row[] = [
  { id: 'item-1', enabled: true, verified: true, active: false },
  { id: 'item-2', enabled: false, verified: null, active: true },
  { id: 'item-3', enabled: true, verified: undefined, active: false }
]

const columns: ColumnDef<Row, BooleanIconCellValue>[] = [
  {
    accessorKey: 'enabled',
    header: 'Enabled (check / em-dash)',
    cell: BooleanIconCell,
    size: 160
  },
  {
    accessorKey: 'verified',
    header: 'Verified (custom aria-label)',
    cell: BooleanIconCell,
    size: 200,
    meta: {
      cellOptions: { label: 'Verified' } satisfies BooleanIconCellOptions
    } as ColumnDef<Row, BooleanIconCellValue>['meta']
  },
  {
    accessorKey: 'active',
    header: 'Active',
    cell: BooleanIconCell,
    size: 100
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

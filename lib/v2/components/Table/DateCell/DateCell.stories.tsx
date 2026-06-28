import type { DateCellOptions, DateCellValue } from './DateCell'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { CellStoryTable } from '../CellStoryTable'
import { DateCell } from './DateCell'

const meta: Meta<typeof DateCell> = {
  title: 'v2/Table/Cells/DateCell'
}

export default meta
type Story = StoryObj<typeof DateCell>

interface Row {
  id: string
  createdAt: DateCellValue
  dateOnly: DateCellValue
  emptyDate: DateCellValue
  invalidDate: DateCellValue
}

const SAMPLE_ROWS: Row[] = [
  {
    id: 'event-1',
    createdAt: '2024-03-15T14:30:45.123Z',
    dateOnly: '2024-03-15T14:30:45.123Z',
    emptyDate: null,
    invalidDate: 'bad-value'
  },
  {
    id: 'event-2',
    createdAt: '2023-07-04T08:00:00.456Z',
    dateOnly: '2023-07-04T08:00:00.456Z',
    emptyDate: undefined,
    invalidDate: 'not-a-date'
  }
]

const columns: ColumnDef<Row, DateCellValue>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Default Format',
    cell: DateCell,
    size: 200
  },
  {
    accessorKey: 'dateOnly',
    header: 'Custom Format (yyyy-MM-dd)',
    cell: DateCell,
    size: 180,
    meta: {
      cellOptions: { format: 'yyyy-MM-dd' } satisfies DateCellOptions
    } as ColumnDef<Row, DateCellValue>['meta']
  },
  {
    accessorKey: 'emptyDate',
    header: 'Empty Date',
    cell: DateCell,
    size: 140
  },
  {
    accessorKey: 'invalidDate',
    header: 'Invalid Date',
    cell: DateCell,
    size: 140
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

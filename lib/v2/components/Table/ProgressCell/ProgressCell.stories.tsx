import type { ProgressCellOptions, ProgressCellValue } from './ProgressCell'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { CAPACITY_FILL_COLORS } from '../../CapacityProgressBar'
import { CellStoryTable } from '../CellStoryTable'
import { ProgressCell } from './ProgressCell'

const meta: Meta<typeof ProgressCell> = {
  title: 'v2/Table/Cells/ProgressCell'
}

export default meta
type Story = StoryObj<typeof ProgressCell>

interface Row {
  id: string
  progress: ProgressCellValue
  customProgress: ProgressCellValue
  functionTooltipProgress: ProgressCellValue
}

const SAMPLE_ROWS: Row[] = [
  {
    id: 'job-1',
    progress: 25,
    customProgress: 25,
    functionTooltipProgress: 25
  },
  {
    id: 'job-2',
    progress: 60,
    customProgress: 60,
    functionTooltipProgress: 60
  },
  {
    id: 'job-3',
    progress: 88,
    customProgress: 88,
    functionTooltipProgress: 88
  },
  {
    id: 'job-4',
    progress: 98,
    customProgress: 98,
    functionTooltipProgress: 98
  },
  {
    id: 'job-5',
    progress: null,
    customProgress: null,
    functionTooltipProgress: null
  }
]

const columns: ColumnDef<Row, ProgressCellValue>[] = [
  {
    accessorKey: 'progress',
    header: 'Progress (default)',
    cell: ProgressCell,
    size: 200
  },
  {
    accessorKey: 'customProgress',
    header: 'Progress (orange, string tooltip)',
    cell: ProgressCell,
    size: 240,
    meta: {
      cellOptions: {
        fillColor: CAPACITY_FILL_COLORS.ORANGE,
        height: 18,
        tooltip: 'Custom fill color and tooltip'
      } satisfies ProgressCellOptions<Row>
    } as ColumnDef<Row, ProgressCellValue>['meta']
  },
  {
    accessorKey: 'functionTooltipProgress',
    header: 'Progress (function tooltip)',
    cell: ProgressCell,
    size: 240,
    meta: {
      cellOptions: {
        tooltip: (cellCtx) => `Row ID: ${cellCtx.row.original.id}`
      } satisfies ProgressCellOptions<Row>
    } as ColumnDef<Row, ProgressCellValue>['meta']
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

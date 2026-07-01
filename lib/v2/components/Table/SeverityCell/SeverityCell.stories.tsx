import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import { CellStoryTable } from '../CellStoryTable'
import { SeverityCell } from './SeverityCell'

const meta: Meta<typeof SeverityCell> = {
  title: 'v2/Table/Cells/SeverityCell'
}

export default meta
type Story = StoryObj<typeof SeverityCell>

interface Row {
  id: string
  severity: string
}

const SAMPLE_ROWS: Row[] = [
  { id: 'evt-1', severity: SEVERITY_TYPES.CRITICAL },
  { id: 'evt-2', severity: SEVERITY_TYPES.MAJOR },
  { id: 'evt-3', severity: SEVERITY_TYPES.MINOR },
  { id: 'evt-4', severity: SEVERITY_TYPES.WARNING },
  { id: 'evt-5', severity: SEVERITY_TYPES.INFO }
]

const columns: ColumnDef<Row, string>[] = [
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: SeverityCell,
    size: 240
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

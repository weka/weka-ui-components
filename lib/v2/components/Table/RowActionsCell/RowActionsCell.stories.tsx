import type { RowAction } from '../Table'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { EMPTY_STRING } from '#consts'

import { ConfigureIcon, DownloadIcon } from '../../../icons'
import { CellStoryTable } from '../CellStoryTable'
import { RowActionsCell } from './RowActionsCell'

const meta: Meta<typeof RowActionsCell> = {
  title: 'v2/Table/cells/RowActionsCell'
}

export default meta
type Story = StoryObj<typeof RowActionsCell>

interface Row {
  id: string
  name: string
  locked: boolean
}

const SAMPLE_ROWS: Row[] = [
  { id: 'fs-prod', name: 'fs-prod', locked: false },
  { id: 'fs-archive', name: 'fs-archive', locked: true },
  { id: 'fs-scratch', name: 'fs-scratch', locked: false }
]

const ROW_ACTIONS: RowAction<Row>[] = [
  {
    key: 'configure',
    text: 'Configure',
    icon: <ConfigureIcon />,
    action: (row) => window.alert(`Configure ${row.name}`)
  },
  {
    key: 'download',
    text: 'Download',
    icon: <DownloadIcon />,
    action: (row) => window.alert(`Download ${row.name}`)
  },
  {
    key: 'delete',
    text: 'Delete',
    action: (row) => window.alert(`Delete ${row.name}`),
    disabled: (row) => row.locked,
    disabledTooltip: 'Unlock the filesystem before deleting it'
  },
  {
    key: 'unlock',
    text: 'Unlock',
    action: (row) => window.alert(`Unlock ${row.name}`),
    hideAction: (row) => !row.locked
  }
]

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 200
  },
  {
    id: 'actions',
    header: EMPTY_STRING,
    cell: RowActionsCell,
    size: 64,
    meta: { rowActions: ROW_ACTIONS } as ColumnDef<Row>['meta']
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

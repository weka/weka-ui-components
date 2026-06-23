import type { ActiveFilter } from '../filterUtils'
import type { RowAction } from './rowActions'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { useState } from 'react'

import { FILTER_TYPES } from '#v2/utils/consts'

import { Table } from './Table'

const meta: Meta<typeof Table> = {
  title: 'v2/Table/Table'
}

export default meta
type Story = StoryObj<typeof Table>

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)',
  height: 520
}

const REGIONS = ['us-east-1', 'us-west-2', 'eu-central-1']
const STATUSES = ['Healthy', 'Degraded', 'Offline']

interface Cluster {
  id: number
  name: string
  region: string
  status: string
}

const DATA: Cluster[] = Array.from({ length: 40 }, (_unused, index) => ({
  id: index + 1,
  name: `cluster-${index + 1}`,
  region: REGIONS[index % REGIONS.length],
  status: STATUSES[index % STATUSES.length]
}))

const COLUMNS: ColumnDef<Cluster>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'region',
    header: 'Region',
    meta: {
      filter: {
        type: FILTER_TYPES.MULTISELECT,
        options: { fixedOptions: REGIONS }
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      filter: {
        type: FILTER_TYPES.MULTISELECT,
        options: { fixedOptions: STATUSES }
      }
    }
  }
]

function TableDemo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  return (
    <div style={CONTAINER_STYLE}>
      <Table
        activeFilters={activeFilters}
        columns={COLUMNS}
        data={DATA}
        onFiltersChange={setActiveFilters}
        showSearch
        title='Clusters'
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <TableDemo />
}

const ROW_ACTIONS: RowAction<Cluster>[] = [
  {
    key: 'edit',
    text: 'Edit',
    action: (row) => alert(`Edit ${row.name}`)
  },
  {
    key: 'delete',
    text: 'Delete',
    action: (row) => alert(`Delete ${row.name}`)
  },
  {
    key: 'offline-only',
    text: 'Restart',
    action: (row) => alert(`Restart ${row.name}`),
    hideAction: (row) => row.status !== 'Offline'
  },
  {
    key: 'degrade-disabled',
    text: 'Degrade (disabled)',
    action: () => undefined,
    disabled: (row) => row.status === 'Degraded'
  }
]

export const WithRowActions: Story = {
  render: () => (
    <div style={CONTAINER_STYLE}>
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
        title='Clusters with row actions'
      />
    </div>
  )
}

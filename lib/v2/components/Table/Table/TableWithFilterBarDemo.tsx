import type { ActiveFilter } from '../filterUtils'
import type { ColumnDef } from '@tanstack/react-table'

import { useState } from 'react'

import { FILTER_TYPES } from '#v2/utils/consts'

import { StatusChip } from '../../StatusChip'
import { Table } from './Table'

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)',
  height: 520
}

const FILTER_BAR_ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
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
  { accessorKey: 'region', header: 'Region' },
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

/** Storybook demo: chips in the `filterBar` slot driving the status column's filtering programmatically — the same pattern the dashboard's Replication Status filter bar uses. */
export function TableWithFilterBarDemo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const selectedStatus = activeFilters.find(
    (filter) => filter.columnId === 'status'
  )?.label

  const toggleStatusFilter = (status: string) => {
    if (selectedStatus === status) {
      setActiveFilters([])
      return
    }
    setActiveFilters([
      {
        columnId: 'status',
        type: FILTER_TYPES.MULTISELECT,
        value: [status],
        label: status
      }
    ])
  }

  const filterBar = (
    <div style={FILTER_BAR_ROW_STYLE}>
      {STATUSES.map((status) => (
        <StatusChip
          key={status}
          count={DATA.filter((cluster) => cluster.status === status).length}
          label={status}
          onClick={() => toggleStatusFilter(status)}
          selected={selectedStatus === status}
        />
      ))}
    </div>
  )

  return (
    <div style={CONTAINER_STYLE}>
      <Table
        activeFilters={activeFilters}
        columns={COLUMNS}
        data={DATA}
        filterBar={filterBar}
        onFiltersChange={setActiveFilters}
        title='Clusters — filterBar slot sharing one border with the grid'
      />
    </div>
  )
}

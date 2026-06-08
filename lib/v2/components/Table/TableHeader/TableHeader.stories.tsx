import type { ActiveFilter } from '../filterUtils'
import type { Meta, StoryObj } from '@storybook/react'
import type { Table, TableOptions } from '@tanstack/react-table'

import { useState } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { EMPTY_STRING, FILTER_TYPES } from '#v2/utils/consts'

import { TableHeader } from './TableHeader'

const meta: Meta<typeof TableHeader> = {
  title: 'v2/Table/TableHeader'
}

export default meta
type Story = StoryObj<typeof TableHeader>

const CONTAINER_STYLE = {
  background: 'var(--bg-secondary)',
  paddingBottom: 24
}

const SEARCH_ECHO_STYLE = {
  padding: '8px 16px',
  color: 'var(--text-secondary)',
  fontSize: 13
}

interface ClusterRow {
  name: string
  region: string
  status: string
}

const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'status', header: 'Status' }
]

const SAMPLE_DATA: ClusterRow[] = [
  { name: 'cluster-1', region: 'us-east-1', status: 'OK' },
  { name: 'cluster-2', region: 'eu-central-1', status: 'OK' }
]

function TableHeaderDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([
    {
      columnId: 'region',
      type: FILTER_TYPES.MULTISELECT,
      value: ['us-east-1'],
      label: 'Region'
    }
  ])
  const [globalSearch, setGlobalSearch] = useState(EMPTY_STRING)

  const table = useReactTable<ClusterRow>({
    columns: COLUMNS,
    data: SAMPLE_DATA,
    getCoreRowModel: getCoreRowModel()
  } as TableOptions<ClusterRow>)

  return (
    <div style={CONTAINER_STYLE}>
      <TableHeader
        activeFilters={filters}
        columns={COLUMNS}
        count={SAMPLE_DATA.length}
        data={SAMPLE_DATA}
        onClearAllFilters={() => setFilters([])}
        onFilterChange={setFilters}
        onGlobalSearch={setGlobalSearch}
        onResetColumnSizing={() => table.resetColumnSizing()}
        showSearch
        table={table as unknown as Table<unknown>}
        title='Clusters'
        onRemoveFilter={(columnId) =>
          setFilters((prev) =>
            prev.filter((filter) => filter.columnId !== columnId)
          )
        }
      />
      {globalSearch ? (
        <div style={SEARCH_ECHO_STYLE}>Searching for: {globalSearch}</div>
      ) : null}
    </div>
  )
}

export const Interactive: Story = {
  render: () => <TableHeaderDemo />
}

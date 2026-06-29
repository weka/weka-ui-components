import type { ActiveFilter } from '../filterUtils'
import type { RowAction } from './rowActions'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { useState } from 'react'

import { FILTER_TYPES } from '#v2/utils/consts'

import { Button } from '../../Button'
import { Table } from './Table'
import { TableWithDrawerDemo } from './TableWithDrawerDemo'

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
        showSearch
        tableActions={<Button variant='primary'>Create Cluster</Button>}
        title='Clusters with row actions'
      />
    </div>
  )
}

interface WideCluster extends Cluster {
  tier: string
  backend: string
  protocol: string
  drives: number
  capacity: string
  iops: string
  latency: string
}

const TIERS = ['Standard', 'Performance', 'Archive']
const BACKENDS = ['NVMe', 'SSD', 'HDD']
const PROTOCOLS = ['NFS', 'SMB', 'S3', 'POSIX']

const WIDE_ITEM_COUNT = 20
const DRIVES_CYCLE = 8
const DRIVES_PER_GROUP = 4
const IOPS_MULTIPLIER = 50
const LATENCY_CYCLE = 5
const LATENCY_STEP = 0.1
const WIDE_CONTAINER_MAX_WIDTH = 800

const WIDE_DATA: WideCluster[] = Array.from(
  { length: WIDE_ITEM_COUNT },
  (_unused, index) => ({
    id: index + 1,
    name: `cluster-${index + 1}`,
    region: REGIONS[index % REGIONS.length],
    status: STATUSES[index % STATUSES.length],
    tier: TIERS[index % TIERS.length],
    backend: BACKENDS[index % BACKENDS.length],
    protocol: PROTOCOLS[index % PROTOCOLS.length],
    drives: ((index % DRIVES_CYCLE) + 1) * DRIVES_PER_GROUP,
    capacity: `${(index + 1) * 10} TB`,
    iops: `${(index + 1) * IOPS_MULTIPLIER}K`,
    latency: `${((index % LATENCY_CYCLE) + 1) * LATENCY_STEP}ms`
  })
)

const WIDE_COLUMNS: ColumnDef<WideCluster>[] = [
  { accessorKey: 'name', header: 'Name', size: 180 },
  { accessorKey: 'region', header: 'Region', size: 160 },
  { accessorKey: 'status', header: 'Status', size: 140 },
  { accessorKey: 'tier', header: 'Tier', size: 140 },
  { accessorKey: 'backend', header: 'Backend', size: 140 },
  { accessorKey: 'protocol', header: 'Protocol', size: 140 },
  { accessorKey: 'drives', header: 'Drives', size: 120 },
  { accessorKey: 'capacity', header: 'Capacity', size: 140 },
  { accessorKey: 'iops', header: 'IOPS', size: 120 },
  { accessorKey: 'latency', header: 'Latency', size: 120 }
]

const WIDE_CONTAINER_STYLE = {
  ...CONTAINER_STYLE,
  maxWidth: WIDE_CONTAINER_MAX_WIDTH
}

const WIDE_ROW_ACTIONS: RowAction<WideCluster>[] = [
  {
    key: 'edit',
    text: 'Edit',
    action: (row) => alert(`Edit ${row.name}`)
  },
  {
    key: 'delete',
    text: 'Delete',
    action: (row) => alert(`Delete ${row.name}`)
  }
]

export const WithRowActionsAndHorizontalScroll: Story = {
  render: () => (
    <div style={WIDE_CONTAINER_STYLE}>
      <Table
        columns={WIDE_COLUMNS}
        data={WIDE_DATA}
        rowActions={WIDE_ROW_ACTIONS}
        title='Wide table — scroll right to see sticky actions column'
      />
    </div>
  )
}

export const WithPinFirstColumn: Story = {
  render: () => (
    <div style={WIDE_CONTAINER_STYLE}>
      <Table
        columns={WIDE_COLUMNS}
        data={WIDE_DATA}
        pinFirstColumn
        rowActions={WIDE_ROW_ACTIONS}
        title='Wide table — first column pinned left, actions pinned right'
      />
    </div>
  )
}

export const WithDrawerSlot: Story = {
  render: () => <TableWithDrawerDemo />
}

const FLEX_COLUMNS: ColumnDef<WideCluster>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 180,
    meta: { flex: true } as ColumnDef<WideCluster>['meta']
  },
  { accessorKey: 'region', header: 'Region', size: 160 },
  { accessorKey: 'status', header: 'Status', size: 140 }
]

export const FramedWithFlexColumn: Story = {
  render: () => (
    <div style={WIDE_CONTAINER_STYLE}>
      <Table
        columns={FLEX_COLUMNS}
        data={WIDE_DATA}
        framed
        rowActions={WIDE_ROW_ACTIONS}
        rowActionsWidth={40}
        title='Framed table — Name flexes, actions column stays 40px'
      />
    </div>
  )
}

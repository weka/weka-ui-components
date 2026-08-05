import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { Table } from '../Table'
import { AggregatedCountCell } from './AggregatedCountCell'

const meta: Meta<typeof AggregatedCountCell> = {
  title: 'v2/Table/Cells/AggregatedCountCell'
}

export default meta
type Story = StoryObj<typeof AggregatedCountCell>

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)',
  height: 420
}

const GROUPING = ['tenant']

interface Namespace {
  tenant: string
  nameSpace: string
  host: string
}

const TENANTS = ['tenant-a', 'tenant-b', 'tenant-c']
const HOSTS = ['host-1', 'host-2', 'host-3', 'host-4', 'host-5']
const NAMESPACE_COUNT = 12

const DATA: Namespace[] = Array.from(
  { length: NAMESPACE_COUNT },
  (_unused, index) => ({
    tenant: TENANTS[index % TENANTS.length],
    nameSpace: `ns-${index + 1}`,
    host: HOSTS[index % HOSTS.length]
  })
)

const COLUMNS: ColumnDef<Namespace>[] = [
  { accessorKey: 'tenant', header: 'Tenant' },
  { accessorKey: 'nameSpace', header: 'Namespace' },
  { accessorKey: 'host', header: 'Assigned host' }
]

export const AsTableDefault: Story = {
  name: 'Default aggregated cell in a grouped table',
  render: () => (
    <div style={CONTAINER_STYLE}>
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        grouping={GROUPING}
        title='Namespaces'
      />
    </div>
  )
}

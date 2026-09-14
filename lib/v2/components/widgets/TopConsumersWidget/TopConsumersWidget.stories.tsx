import type { TopConsumersColumn } from './types'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import {
  TOP_CONSUMERS_METRICS,
  type TopConsumersMetric
} from './topConsumersConsts'
import { TopConsumersWidget } from './TopConsumersWidget'

const meta: Meta<typeof TopConsumersWidget> = {
  title: 'v2/Widgets/TopConsumersWidget',
  component: TopConsumersWidget,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof TopConsumersWidget>

const BYTES_PER_GB = 1073741824
const toBytes = (gb: number) => gb * BYTES_PER_GB
const formatThroughput = (value: number) =>
  `${(value / BYTES_PER_GB).toFixed(2)} GB/s`
const formatRequests = (value: number) => `${value.toLocaleString()}/s`

/* Sample rows in GB/s (and requests/s for buckets); scaled to bytes below. */
const FILESYSTEM_ROWS = [
  { name: 'fs-prod-app01', gb: 6.56 },
  { name: 'fs-prod-app02', gb: 4.1 },
  { name: 'fs-analytics', gb: 2.46 },
  { name: 'fs-backup', gb: 1.97 },
  { name: 'fs-scratch', gb: 1.31 }
]
const CLIENT_ROWS = [
  { name: 'compute-node-014', gb: 3.38 },
  { name: 'compute-node-022', gb: 2.41 },
  { name: 'gpu-node-003', gb: 1.93 },
  { name: 'gpu-node-007', gb: 1.16 },
  { name: 'ingest-node-001', gb: 0.77 }
]
const BUCKET_ROWS = [
  { name: 'acme-ingest-raw', requests: 3478, gb: 0.497 },
  { name: 'acme-model-artifacts', requests: 1932, gb: 0.276 },
  { name: 'acme-logs-archive', requests: 1159, gb: 0.166 },
  { name: 'acme-backups', requests: 773, gb: 0.11 },
  { name: 'acme-analytics-export', requests: 386, gb: 0.055 }
]
const SHARES = { filesystems: 0.85, clients: 0.5, buckets: 0.92 }

const filesystems: TopConsumersColumn = {
  key: 'filesystems',
  title: 'Top Filesystems',
  items: FILESYSTEM_ROWS.map(({ name, gb }) => ({ name, value: toBytes(gb) })),
  formatValue: formatThroughput,
  shareOfTotal: SHARES.filesystems,
  shareLabel: 'tenant throughput',
  onNavigate: () => undefined
}

const clients: TopConsumersColumn = {
  key: 'clients',
  title: 'Top Clients',
  items: CLIENT_ROWS.map(({ name, gb }) => ({ name, value: toBytes(gb) })),
  formatValue: formatThroughput,
  shareOfTotal: SHARES.clients,
  shareLabel: 'tenant throughput'
}

const buckets: TopConsumersColumn = {
  key: 'buckets',
  title: 'Top S3 Buckets',
  badge: 'NEW',
  items: BUCKET_ROWS.map(({ name, requests, gb }) => ({
    name,
    value: requests,
    secondaryValue: toBytes(gb)
  })),
  formatValue: formatRequests,
  formatSecondaryValue: formatThroughput,
  shareOfTotal: SHARES.buckets,
  shareLabel: 'tenant S3 requests',
  onNavigate: () => undefined
}

const STACKED_WIDTH_PX = 600

function ControlledWidget({
  columns
}: Readonly<{ columns: TopConsumersColumn[] }>) {
  const [metric, setMetric] = useState<TopConsumersMetric>(
    TOP_CONSUMERS_METRICS.THROUGHPUT
  )
  return (
    <TopConsumersWidget
      columns={columns}
      metric={metric}
      onMetricChange={setMetric}
    />
  )
}

export const Default: Story = {
  render: () => <ControlledWidget columns={[filesystems, clients, buckets]} />
}

export const MixedStates: Story = {
  render: () => (
    <ControlledWidget
      columns={[
        { ...filesystems, isLoading: true },
        { ...clients, isError: true },
        {
          ...buckets,
          items: [],
          emptyMessage: 'S3 buckets are not available for tenants yet'
        }
      ]}
    />
  )
}

export const Stacked: Story = {
  render: () => (
    <div style={{ width: `${STACKED_WIDTH_PX}px` }}>
      <ControlledWidget columns={[filesystems, clients, buckets]} />
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/react'

import { InventoryCard } from './InventoryCard'

const meta: Meta<typeof InventoryCard> = {
  title: 'v2/Widgets/InventoryCard',
  component: InventoryCard
}

export default meta
type Story = StoryObj<typeof InventoryCard>

const defaultData = [
  {
    id: 'servers',
    title: 'Servers',
    subtitle: 'Active / Total',
    value: '8 / 10',
    description: '80% active',
    percentage: 80
  },
  {
    id: 'drivers',
    title: 'Drives',
    subtitle: 'Active / Total',
    value: '32 / 32',
    description: '100% active',
    percentage: 100
  },
  {
    id: 'filesystems',
    title: 'Filesystems',
    subtitle: 'Total',
    value: '5',
    description: 'Filesystems'
  },
  {
    id: 's3buckets',
    title: 'S3 Buckets',
    subtitle: 'Total',
    value: '2',
    description: 'Buckets'
  }
] as const

const defaultWrapperStyle = { width: '360px' }
const narrowWrapperStyle = { width: '280px', height: '240px' }

export const Default: Story = {
  render: () => (
    <div style={defaultWrapperStyle}>
      <InventoryCard data={[...defaultData]} />
    </div>
  )
}

export const Narrow: Story = {
  render: () => (
    <div style={narrowWrapperStyle}>
      <InventoryCard data={[...defaultData]} />
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/react'

import { CLUSTER_ICON_VARIANTS, ClusterIcon } from './ClusterIcon'

const meta: Meta<typeof ClusterIcon> = {
  title: 'v2/Icons/ClusterIcon',
  component: ClusterIcon,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ClusterIcon>

const rowStyle = { display: 'flex', gap: '24px', alignItems: 'center' }

const clusterTypes = ['aws', 'gcp', 'azure', 'k8s', 'oci', 'onprem', 'weka']

export const AllProviders: Story = {
  render: () => (
    <div style={rowStyle}>
      {clusterTypes.map((type) => (
        <ClusterIcon
          key={type}
          clusterType={type}
          showLabel
        />
      ))}
    </div>
  )
}

export const HeaderStyle: Story = {
  render: () => (
    <div style={rowStyle}>
      {clusterTypes.map((type) => (
        <ClusterIcon
          key={type}
          clusterType={type}
          showLabel
          variant={CLUSTER_ICON_VARIANTS.HEADER_STYLE}
        />
      ))}
    </div>
  )
}

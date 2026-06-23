import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_CONTENT, EMPTY_STRING } from '#consts'

import { StatBox } from './StatBox'

const meta: Meta<typeof StatBox> = {
  title: 'v2/StatBox',
  component: StatBox,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof StatBox>

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  width: '100%',
  containerType: 'inline-size' as const
}

export const Row: Story = {
  render: () => (
    <div style={rowStyle}>
      <StatBox
        colorVariant='purple'
        dataTestId='clusters'
        mainValue={12}
        title='Clusters'
        subStats={[
          { label: 'US East', value: 7 },
          { label: 'EU West', value: 5 }
        ]}
      />
      <StatBox
        colorVariant='fuchsia'
        dataTestId='capacity'
        mainUnit='TB'
        mainValue='1.2'
        title='Usable Capacity'
        subStats={[
          { label: 'Used', value: '1.05', unit: 'TB' },
          { label: 'Free', value: '125', unit: 'GB' }
        ]}
      />
      <StatBox
        colorVariant='cyan'
        dataTestId='throughput'
        mainUnit='MB/s'
        mainValue='146.8'
        title='Throughput'
        subStats={[
          { label: 'Read', value: '132.0', unit: 'MB/s' },
          { label: 'Write', value: '14.8', unit: 'MB/s' }
        ]}
      />
      <StatBox
        colorVariant='aqua'
        dataTestId='iops'
        mainUnit='OPS'
        mainValue='732.4K'
        title='IOPS'
        subStats={[
          { label: 'Read', value: '610.2K', unit: 'OPS' },
          { label: 'Write', value: '122.2K', unit: 'OPS' }
        ]}
      />
      <StatBox
        colorVariant='peach'
        dataTestId='clients'
        mainValue={64}
        title='Clients'
        subStats={[
          { label: 'Active', value: 61 },
          { label: 'Inactive', value: 3 }
        ]}
      />
    </div>
  )
}

const SKELETON_SUBSTATS = [
  { label: EMPTY_STRING, value: EMPTY_STRING },
  { label: EMPTY_STRING, value: EMPTY_STRING }
]

const SKELETON_TILES = [
  { colorVariant: 'purple' as const, title: 'Clusters' },
  { colorVariant: 'fuchsia' as const, title: 'Usable Capacity' },
  { colorVariant: 'cyan' as const, title: 'Throughput' },
  { colorVariant: 'aqua' as const, title: 'IOPS' },
  { colorVariant: 'peach' as const, title: 'Clients' }
]

export const Loading: Story = {
  render: () => (
    <div style={rowStyle}>
      {SKELETON_TILES.map((tile) => (
        <StatBox
          key={tile.title}
          colorVariant={tile.colorVariant}
          mainValue={EMPTY_CONTENT}
          status='loading'
          subStats={SKELETON_SUBSTATS}
          title={tile.title}
        />
      ))}
    </div>
  )
}

export const ErrorState: Story = {
  render: () => (
    <div style={rowStyle}>
      {SKELETON_TILES.map((tile) => (
        <StatBox
          key={tile.title}
          colorVariant={tile.colorVariant}
          mainValue={EMPTY_CONTENT}
          status='error'
          subStats={SKELETON_SUBSTATS}
          title={tile.title}
        />
      ))}
    </div>
  )
}

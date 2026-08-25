import type { Meta, StoryObj } from '@storybook/react'

import { NOP } from '#consts'

import { STATUS_VARIANTS } from '../Table/StatusCell'
import { StatusChip } from './StatusChip'

const meta: Meta<typeof StatusChip> = {
  title: 'v2/StatusChip',
  component: StatusChip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof StatusChip>

const rowStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap' as const }

export const Variants: Story = {
  render: () => (
    <div style={rowStyle}>
      <StatusChip
        label='Up'
        variant={STATUS_VARIANTS.UP}
      />
      <StatusChip
        label='Replicating'
        variant={STATUS_VARIANTS.INFO}
      />
      <StatusChip
        label='Working'
        variant={STATUS_VARIANTS.WORKING}
      />
      <StatusChip
        label='Degraded'
        variant={STATUS_VARIANTS.DEGRADED}
      />
      <StatusChip
        label='Down'
        variant={STATUS_VARIANTS.DOWN}
      />
    </div>
  )
}

export const WithCount: Story = {
  render: () => (
    <div style={rowStyle}>
      <StatusChip
        count={12}
        label='Healthy'
        variant={STATUS_VARIANTS.UP}
      />
      <StatusChip
        count={3}
        label='Error'
        variant={STATUS_VARIANTS.DOWN}
      />
    </div>
  )
}

export const FilterChip: Story = {
  render: () => (
    <div style={rowStyle}>
      <StatusChip
        count={12}
        label='Healthy'
        onClick={NOP}
        selected
        variant={STATUS_VARIANTS.UP}
      />
      <StatusChip
        count={3}
        label='Error'
        onClick={NOP}
        variant={STATUS_VARIANTS.DOWN}
      />
      <StatusChip
        count={5}
        label='eu-west-1'
        onClick={NOP}
      />
    </div>
  )
}

export const CustomColor: Story = {
  args: {
    color: '#7c3aed',
    label: 'Custom'
  }
}

export const Tinted: Story = {
  render: () => (
    <div style={rowStyle}>
      <StatusChip
        label='Running'
        tinted
        variant={STATUS_VARIANTS.INFO}
      />
      <StatusChip
        label='Paused'
        tinted
        variant={STATUS_VARIANTS.DEGRADED}
      />
      <StatusChip
        label='Error'
        tinted
        variant={STATUS_VARIANTS.DOWN}
      />
      <StatusChip
        label='Up'
        tinted
        variant={STATUS_VARIANTS.UP}
      />
      <StatusChip
        label='Working'
        tinted
        variant={STATUS_VARIANTS.WORKING}
      />
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/react'

import { AdditionalAmountChip } from './AdditionalAmountChip'

const meta: Meta<typeof AdditionalAmountChip> = {
  title: 'v2/AdditionalAmountChip',
  component: AdditionalAmountChip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AdditionalAmountChip>

export const Default: Story = {
  args: {
    count: 5,
    tooltipContent: 'eth1, eth2, eth3, eth4, eth5'
  }
}

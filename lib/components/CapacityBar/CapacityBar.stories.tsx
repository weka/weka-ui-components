import type { Meta, StoryObj } from 'storybook-solidjs'
import CapacityBar from './CapacityBar'

import React from 'react'

const meta: Meta<typeof CapacityBar> = {
  component: CapacityBar,
  title: 'Components/CapacityBar'
}

export default meta
type OneUsageCapacity = StoryObj<typeof CapacityBar>

export const OneUsageCapacity: OneUsageCapacity = {
  args: {
    firstUsage: 0.5
  },
  render: (args: object) => <CapacityBar {...args} />
}

type TwoUsageCapacity = StoryObj<typeof CapacityBar>

export const TwoUsageCapacity: TwoUsageCapacity = {
  args: {
    firstUsage: 0.4,
    secondUsage: 0.8
  },
  render: (args: object) => <CapacityBar {...args} />
}

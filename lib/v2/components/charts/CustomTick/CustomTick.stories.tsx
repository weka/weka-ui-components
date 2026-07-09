import type { Meta, StoryObj } from '@storybook/react'

import { CustomTick } from './CustomTick'

const meta: Meta<typeof CustomTick> = {
  title: 'v2/Charts/CustomTick',
  component: CustomTick
}

export default meta
type Story = StoryObj<typeof CustomTick>

const SAMPLE_TIMESTAMP = new Date('2024-03-15T14:30:00').getTime()

export const ShortAndLongRange: Story = {
  render: () => (
    <svg
      height={60}
      width={260}
    >
      <CustomTick
        payload={{ value: SAMPLE_TIMESTAMP }}
        range='1h'
        x={60}
        y={24}
      />
      <CustomTick
        payload={{ value: SAMPLE_TIMESTAMP }}
        range='7d'
        x={180}
        y={18}
      />
    </svg>
  )
}

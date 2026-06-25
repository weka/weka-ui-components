import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { SegmentedControl } from './SegmentedControl'

const TIME_RANGE_OPTIONS = [
  { value: '1h', label: '1H' },
  { value: '1d', label: '1D' },
  { value: '7d', label: '7D' }
]

function SegmentedControlDemo() {
  const [value, setValue] = useState('1d')
  return (
    <SegmentedControl
      onChange={setValue}
      options={TIME_RANGE_OPTIONS}
      value={value}
    />
  )
}

const meta: Meta<typeof SegmentedControlDemo> = {
  title: 'v2/SegmentedControl',
  component: SegmentedControlDemo
}

export default meta
type Story = StoryObj<typeof SegmentedControlDemo>

export const Interactive: Story = {}

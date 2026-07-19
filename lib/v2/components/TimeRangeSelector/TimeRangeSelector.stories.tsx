import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { type CustomTimeRange, TimeRangeSelector } from './TimeRangeSelector'

const meta: Meta<typeof TimeRangeSelector> = {
  title: 'v2/TimeRangeSelector',
  component: TimeRangeSelector,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof TimeRangeSelector>

function TimeRangeSelectorDemo() {
  const [range, setRange] = useState<string | CustomTimeRange>('24h')

  return (
    <TimeRangeSelector
      onRangeChange={setRange}
      selectedRange={range}
    />
  )
}

export const Interactive: Story = {
  render: () => <TimeRangeSelectorDemo />
}

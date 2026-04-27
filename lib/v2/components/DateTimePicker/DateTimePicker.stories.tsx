import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DateTime } from 'luxon'

import { DateTimePicker } from './DateTimePicker'

const CONTAINER_STYLE = { padding: '24px', minHeight: '600px' }

interface DemoProps {
  initialValue?: DateTime
  minDate?: DateTime
  maxDate?: DateTime
  showTime?: boolean
  canClear?: boolean
}

function DateTimePickerDemo({
  initialValue,
  minDate,
  maxDate,
  showTime,
  canClear
}: Readonly<DemoProps>) {
  const [value, setValue] = useState<DateTime | undefined>(initialValue)
  return (
    <div style={CONTAINER_STYLE}>
      <DateTimePicker
        canClear={canClear}
        enableCustomFormat
        maxDate={maxDate}
        minDate={minDate}
        onChange={setValue}
        showSeconds={false}
        showTime={showTime}
        value={value}
      />
    </div>
  )
}

const meta: Meta<typeof DateTimePickerDemo> = {
  title: 'v2/DateTimePicker',
  component: DateTimePickerDemo,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof DateTimePickerDemo>

export const Default: Story = {
  args: {
    initialValue: DateTime.now(),
    maxDate: DateTime.now()
  }
}

export const WithMinMaxBounds: Story = {
  args: {
    initialValue: DateTime.now(),
    minDate: DateTime.now().minus({ days: 7 }),
    maxDate: DateTime.now().plus({ days: 7 })
  }
}

export const DateOnly: Story = {
  args: {
    initialValue: DateTime.now(),
    showTime: false
  }
}

export const NotClearable: Story = {
  args: {
    initialValue: DateTime.now(),
    canClear: false
  }
}

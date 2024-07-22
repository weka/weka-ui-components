import type { Meta, StoryObj } from '@storybook/react'
import { default as DateTimePickerComponent } from './DateTimePicker'

const meta: Meta<typeof DateTimePickerComponent> = {
  component: DateTimePickerComponent,
  title: 'Components/DateTimePicker'
}
export default meta

type Story = StoryObj<typeof DateTimePickerComponent>

export const Default: Story = {}

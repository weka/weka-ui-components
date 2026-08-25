import type { Meta, StoryObj } from '@storybook/react'

import { Stepper } from './Stepper'

const meta: Meta<typeof Stepper> = {
  title: 'v2/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    currentIndex: { control: { type: 'number', min: 0, max: 3 } }
  }
}

export default meta
type Story = StoryObj<typeof Stepper>

const STEPS = [
  { label: 'Source & Target' },
  { label: 'Copy Strategy' },
  { label: 'Schedule' },
  { label: 'Review' }
]

export const Vertical: Story = {
  args: {
    steps: STEPS,
    currentIndex: 1
  }
}

export const Horizontal: Story = {
  args: {
    steps: STEPS,
    currentIndex: 1,
    orientation: 'horizontal'
  }
}

export const AllDone: Story = {
  args: {
    steps: STEPS,
    currentIndex: STEPS.length
  }
}

export const WithError: Story = {
  args: {
    steps: [
      { label: 'Source & Target' },
      { label: 'Copy Strategy', hasError: true },
      { label: 'Schedule' },
      { label: 'Review' }
    ],
    currentIndex: 2
  }
}

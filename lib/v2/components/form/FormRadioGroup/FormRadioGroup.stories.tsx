import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormRadioGroup } from './FormRadioGroup'

const MODE_OPTIONS = [
  { label: 'Manual', value: 'manual' },
  { label: 'Automatic', value: 'auto' }
]

const meta: Meta<typeof FormRadioGroup> = {
  title: 'v2/form/FormRadioGroup',
  component: FormRadioGroup,
  tags: ['autodocs'],
  decorators: [withFormProvider({ mode: 'manual' })]
}

export default meta
type Story = StoryObj<typeof FormRadioGroup>

export const Default: Story = {
  args: { name: 'mode', label: 'Mode', options: MODE_OPTIONS }
}

export const Row: Story = {
  args: { name: 'mode', label: 'Mode', options: MODE_OPTIONS, direction: 'row' }
}

export const Disabled: Story = {
  args: { name: 'mode', label: 'Mode', options: MODE_OPTIONS, disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      { mode: 'manual' },
      { mode: 'Automatic mode is unavailable' }
    )
  ],
  args: { name: 'mode', label: 'Mode', options: MODE_OPTIONS }
}

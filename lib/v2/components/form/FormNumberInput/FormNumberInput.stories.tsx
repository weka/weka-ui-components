import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormNumberInput } from './FormNumberInput'

const meta: Meta<typeof FormNumberInput> = {
  title: 'v2/form/FormNumberInput',
  component: FormNumberInput,
  tags: ['autodocs'],
  decorators: [withFormProvider({ count: undefined })]
}

export default meta
type Story = StoryObj<typeof FormNumberInput>

export const Default: Story = {
  args: { name: 'count', label: 'Label', min: 0, max: 100 }
}

export const Required: Story = {
  args: { name: 'count', label: 'Label', min: 0, max: 100, required: true }
}

export const WithInfo: Story = {
  args: {
    name: 'count',
    label: 'Label',
    min: 0,
    max: 100,
    info: 'Explains what this field is for'
  }
}

export const Disabled: Story = {
  args: { name: 'count', label: 'Label', min: 0, max: 100, disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ count: undefined }, { count: 'This field is invalid' })
  ],
  args: { name: 'count', label: 'Label', min: 0, max: 100 }
}

import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormIpRangeInput } from './FormIpRangeInput'

const meta: Meta<typeof FormIpRangeInput> = {
  title: 'v2/form/FormIpRangeInput',
  component: FormIpRangeInput,
  tags: ['autodocs'],
  decorators: [withFormProvider({ range: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormIpRangeInput>

export const Default: Story = {
  args: { name: 'range', label: 'Label' }
}

export const Required: Story = {
  args: { name: 'range', label: 'Label', required: true }
}

export const WithInfo: Story = {
  args: {
    name: 'range',
    label: 'Label',
    info: 'Explains what this field is for'
  }
}

export const WithEndpointLabels: Story = {
  args: { name: 'range', label: 'Label', startLabel: 'From', endLabel: 'To' }
}

export const Disabled: Story = {
  args: { name: 'range', label: 'Label', disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      { range: EMPTY_STRING },
      { range: 'This field is invalid' }
    )
  ],
  args: { name: 'range', label: 'Label' }
}

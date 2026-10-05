import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormIpSubnetInput } from './FormIpSubnetInput'

const meta: Meta<typeof FormIpSubnetInput> = {
  title: 'v2/form/FormIpSubnetInput',
  component: FormIpSubnetInput,
  tags: ['autodocs'],
  decorators: [withFormProvider({ subnet: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormIpSubnetInput>

export const Default: Story = {
  args: { name: 'subnet', label: 'Label' }
}

export const Required: Story = {
  args: { name: 'subnet', label: 'Label', required: true }
}

export const WithInfo: Story = {
  args: {
    name: 'subnet',
    label: 'Label',
    info: 'Explains what this field is for'
  }
}

export const Disabled: Story = {
  args: { name: 'subnet', label: 'Label', disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      { subnet: EMPTY_STRING },
      { subnet: 'This field is invalid' }
    )
  ],
  args: { name: 'subnet', label: 'Label' }
}

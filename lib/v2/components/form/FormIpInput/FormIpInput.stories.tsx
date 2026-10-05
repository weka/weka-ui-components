import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormIpInput } from './FormIpInput'

const meta: Meta<typeof FormIpInput> = {
  title: 'v2/form/FormIpInput',
  component: FormIpInput,
  tags: ['autodocs'],
  decorators: [withFormProvider({ ip: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormIpInput>

export const Default: Story = {
  args: { name: 'ip', label: 'Label' }
}

export const Required: Story = {
  args: { name: 'ip', label: 'Label', required: true }
}

export const WithInfo: Story = {
  args: { name: 'ip', label: 'Label', info: 'Explains what this field is for' }
}

export const Disabled: Story = {
  args: { name: 'ip', label: 'Label', disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ ip: EMPTY_STRING }, { ip: 'This field is invalid' })
  ],
  args: { name: 'ip', label: 'Label' }
}

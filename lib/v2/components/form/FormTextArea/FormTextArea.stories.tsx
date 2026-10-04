import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormTextArea } from './FormTextArea'

const BASE_ARGS = { name: 'pem', label: 'Label', placeholder: 'Paste content' }

const meta: Meta<typeof FormTextArea> = {
  title: 'v2/form/FormTextArea',
  component: FormTextArea,
  tags: ['autodocs'],
  decorators: [withFormProvider({ pem: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormTextArea>

export const Default: Story = {
  args: { ...BASE_ARGS }
}

export const Required: Story = {
  args: {
    ...BASE_ARGS,
    required: true
  }
}

export const WithInfo: Story = {
  args: {
    ...BASE_ARGS,
    info: 'Explains what this field is for'
  }
}

export const Disabled: Story = {
  args: {
    ...BASE_ARGS,
    disabled: true
  }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ pem: EMPTY_STRING }, { pem: 'This field is invalid' })
  ],
  args: { ...BASE_ARGS }
}

import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormTextInput } from './FormTextInput'

const BASE_ARGS = {
  name: 'hostname',
  label: 'Label',
  placeholder: 'e.g. node-1'
}

const meta: Meta<typeof FormTextInput> = {
  title: 'v2/form/FormTextInput',
  component: FormTextInput,
  tags: ['autodocs'],
  decorators: [withFormProvider({ hostname: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormTextInput>

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
    withFormProvider(
      { hostname: EMPTY_STRING },
      { hostname: 'This field is invalid' }
    )
  ],
  args: { ...BASE_ARGS }
}

export const Email: Story = {
  args: {
    name: 'hostname',
    label: 'Email',
    type: 'email',
    placeholder: 'name@example.com'
  }
}

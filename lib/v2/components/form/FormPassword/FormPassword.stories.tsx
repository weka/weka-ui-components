import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormPassword } from './FormPassword'

const meta: Meta<typeof FormPassword> = {
  title: 'v2/form/FormPassword',
  component: FormPassword,
  tags: ['autodocs'],
  decorators: [withFormProvider({ secret: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormPassword>

export const Default: Story = {
  args: { name: 'secret', label: 'Label' }
}

export const Required: Story = {
  args: { name: 'secret', label: 'Label', required: true }
}

export const WithInfo: Story = {
  args: {
    name: 'secret',
    label: 'Label',
    info: 'Explains what this field is for'
  }
}

export const Disabled: Story = {
  args: { name: 'secret', label: 'Label', disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      { secret: EMPTY_STRING },
      { secret: 'This field is invalid' }
    )
  ],
  args: { name: 'secret', label: 'Label' }
}

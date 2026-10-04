import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { withFormProvider } from '../formStoryUtils'
import { FormFileUpload } from './FormFileUpload'

const BASE_ARGS = { name: 'fileContent', label: 'Upload certificate' }

const meta: Meta<typeof FormFileUpload> = {
  title: 'v2/form/FormFileUpload',
  component: FormFileUpload,
  tags: ['autodocs'],
  decorators: [withFormProvider({ fileContent: EMPTY_STRING })]
}

export default meta
type Story = StoryObj<typeof FormFileUpload>

export const Default: Story = {
  args: { ...BASE_ARGS }
}

export const Accept: Story = {
  args: { ...BASE_ARGS, accept: '.pem' }
}

export const Disabled: Story = {
  args: { ...BASE_ARGS, disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      { fileContent: EMPTY_STRING },
      { fileContent: 'A certificate is required' }
    )
  ],
  args: { ...BASE_ARGS }
}

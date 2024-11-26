import type { Meta, StoryObj } from '@storybook/react'
import UploadField from './UploadField'

const meta: Meta<typeof UploadField> = {
  component: UploadField
}
export default meta

type Story = StoryObj<typeof UploadField>

export const Default: Story = {
  args: {
    label: 'Browse',
    info: 'Browse files',
    isRequired: true,
    error: 'woot'
  }
}

export const WithDescription: Story = {
  args: {
    label: 'Browse',
    info: 'Browse files',
    isRequired: true,
    description: 'Description',
    error: 'Error'
  }
}

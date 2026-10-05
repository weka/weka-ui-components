import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormMultiSelect } from './FormMultiSelect'

const TAG_OPTIONS = ['alpha', 'beta', 'gamma']

const meta: Meta<typeof FormMultiSelect> = {
  title: 'v2/form/FormMultiSelect',
  component: FormMultiSelect,
  tags: ['autodocs'],
  decorators: [withFormProvider({ tags: ['alpha'] })]
}

export default meta
type Story = StoryObj<typeof FormMultiSelect>

export const Default: Story = {
  args: { name: 'tags', label: 'Tags', options: TAG_OPTIONS }
}

export const Required: Story = {
  args: { name: 'tags', label: 'Tags', options: TAG_OPTIONS, required: true }
}

export const WithInfo: Story = {
  args: {
    name: 'tags',
    label: 'Tags',
    options: TAG_OPTIONS,
    info: 'Used to group resources'
  }
}

export const AllowNewValues: Story = {
  args: {
    name: 'tags',
    label: 'Tags',
    options: TAG_OPTIONS,
    allowNewValues: true
  }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ tags: [] }, { tags: 'At least one tag is required' })
  ],
  args: { name: 'tags', label: 'Tags', options: TAG_OPTIONS }
}

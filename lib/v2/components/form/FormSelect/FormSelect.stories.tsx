import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormSelect } from './FormSelect'

const TIER_OPTIONS = [
  { label: 'Hot', value: 'hot' },
  { label: 'Cold', value: 'cold' }
]

const meta: Meta<typeof FormSelect> = {
  title: 'v2/form/FormSelect',
  component: FormSelect,
  tags: ['autodocs'],
  decorators: [withFormProvider({ tier: 'hot' })]
}

export default meta
type Story = StoryObj<typeof FormSelect>

export const Default: Story = {
  args: { name: 'tier', label: 'Tier', options: TIER_OPTIONS }
}

export const Required: Story = {
  args: { name: 'tier', label: 'Tier', options: TIER_OPTIONS, required: true }
}

export const WithInfo: Story = {
  args: {
    name: 'tier',
    label: 'Tier',
    options: TIER_OPTIONS,
    info: 'Storage tier for new data'
  }
}

export const Disabled: Story = {
  args: { name: 'tier', label: 'Tier', options: TIER_OPTIONS, disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ tier: 'hot' }, { tier: 'Pick another tier' })
  ],
  args: { name: 'tier', label: 'Tier', options: TIER_OPTIONS }
}

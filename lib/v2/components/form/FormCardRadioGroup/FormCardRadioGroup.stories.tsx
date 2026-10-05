import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormCardRadioGroup } from './FormCardRadioGroup'

const PLAN_OPTIONS = [
  { title: 'Basic', description: 'For small teams', value: 'basic' },
  { title: 'Pro', description: 'For larger teams', value: 'pro' }
]

const meta: Meta<typeof FormCardRadioGroup> = {
  title: 'v2/form/FormCardRadioGroup',
  component: FormCardRadioGroup,
  tags: ['autodocs'],
  decorators: [withFormProvider({ plan: 'basic' })]
}

export default meta
type Story = StoryObj<typeof FormCardRadioGroup>

export const Default: Story = {
  args: { name: 'plan', label: 'Plan', options: PLAN_OPTIONS }
}

export const Vertical: Story = {
  args: {
    name: 'plan',
    label: 'Plan',
    options: PLAN_OPTIONS,
    orientation: 'vertical'
  }
}

export const Disabled: Story = {
  args: { name: 'plan', label: 'Plan', options: PLAN_OPTIONS, disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ plan: 'basic' }, { plan: 'This plan is unavailable' })
  ],
  args: { name: 'plan', label: 'Plan', options: PLAN_OPTIONS }
}

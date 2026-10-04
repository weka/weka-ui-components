import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormSwitch } from './FormSwitch'

const meta: Meta<typeof FormSwitch> = {
  title: 'v2/form/FormSwitch',
  component: FormSwitch,
  tags: ['autodocs'],
  decorators: [withFormProvider({ enabled: false })]
}

export default meta
type Story = StoryObj<typeof FormSwitch>

export const Default: Story = {
  args: { name: 'enabled', label: 'Enabled' }
}

export const LabelFirst: Story = {
  args: { name: 'enabled', label: 'Enabled', labelFirst: true }
}

export const Required: Story = {
  args: { name: 'enabled', label: 'Enabled', required: true }
}

export const WithTooltip: Story = {
  args: { name: 'enabled', label: 'Enabled', tooltip: 'Turns the feature on' }
}

export const Disabled: Story = {
  args: { name: 'enabled', label: 'Enabled', disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider({ enabled: false }, { enabled: 'Must be enabled' })
  ],
  args: { name: 'enabled', label: 'Enabled' }
}

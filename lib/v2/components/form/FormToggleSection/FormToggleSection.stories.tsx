import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormToggleSection } from './FormToggleSection'

const BASE_ARGS = { name: 'dataReduction', label: 'Data Reduction' }

const meta: Meta<typeof FormToggleSection> = {
  title: 'v2/form/FormToggleSection',
  component: FormToggleSection,
  tags: ['autodocs'],
  decorators: [withFormProvider({ dataReduction: false })]
}

export default meta
type Story = StoryObj<typeof FormToggleSection>

export const Default: Story = {
  args: { ...BASE_ARGS }
}

export const WithLabelTooltip: Story = {
  args: {
    ...BASE_ARGS,
    labelTooltip: 'Compresses and deduplicates data'
  }
}

export const On: Story = {
  decorators: [withFormProvider({ dataReduction: true })],
  args: { ...BASE_ARGS }
}

export const Disabled: Story = {
  args: { ...BASE_ARGS, disabled: true }
}

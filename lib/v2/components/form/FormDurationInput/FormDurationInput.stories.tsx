import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormDurationInput } from './FormDurationInput'

const SHORT_UNITS = [
  { label: 'Days', value: 86400 },
  { label: 'Hours', value: 3600 }
]

const meta: Meta<typeof FormDurationInput> = {
  title: 'v2/form/FormDurationInput',
  component: FormDurationInput,
  tags: ['autodocs'],
  decorators: [
    withFormProvider({
      retention: {
        number: undefined,
        unit: { label: undefined, value: undefined }
      }
    })
  ]
}

export default meta
type Story = StoryObj<typeof FormDurationInput>

export const Default: Story = {
  args: { name: 'retention', label: 'Retention' }
}

export const Required: Story = {
  args: { name: 'retention', label: 'Retention', required: true }
}

export const Prefilled: Story = {
  decorators: [
    withFormProvider({
      retention: { number: 2, unit: { label: 'Hr', value: 3600 } }
    })
  ],
  args: { name: 'retention', label: 'Retention' }
}

export const CustomUnits: Story = {
  args: { name: 'retention', label: 'Retention', unitOptions: SHORT_UNITS }
}

export const Disabled: Story = {
  args: { name: 'retention', label: 'Retention', disabled: true }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      {
        retention: {
          number: undefined,
          unit: { label: undefined, value: undefined }
        }
      },
      { retention: 'Retention is required' }
    )
  ],
  args: { name: 'retention', label: 'Retention' }
}

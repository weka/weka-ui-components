import type { Meta, StoryObj } from '@storybook/react'

import { withFormProvider } from '../formStoryUtils'
import { FormCapacityInput } from './FormCapacityInput'

const KILO = 1000
const MB = KILO * KILO
const GB = MB * KILO
const TB = GB * KILO

const UNIT_OPTIONS = [
  { label: 'TB', value: TB },
  { label: 'GB', value: GB },
  { label: 'MB', value: MB },
  { label: 'Bytes', value: 1 }
]

const meta: Meta<typeof FormCapacityInput> = {
  title: 'v2/form/FormCapacityInput',
  component: FormCapacityInput,
  tags: ['autodocs'],
  decorators: [
    withFormProvider({
      capacity: {
        number: undefined,
        unit: { label: undefined, value: undefined }
      }
    })
  ]
}

export default meta
type Story = StoryObj<typeof FormCapacityInput>

export const Default: Story = {
  args: { name: 'capacity', label: 'Capacity', unitOptions: UNIT_OPTIONS }
}

export const Required: Story = {
  args: {
    name: 'capacity',
    label: 'Capacity',
    unitOptions: UNIT_OPTIONS,
    required: true
  }
}

export const WithInfo: Story = {
  args: {
    name: 'capacity',
    label: 'Capacity',
    unitOptions: UNIT_OPTIONS,
    info: 'Total usable capacity'
  }
}

export const Prefilled: Story = {
  decorators: [
    withFormProvider({
      capacity: { number: 5, unit: { label: 'MB', value: MB } }
    })
  ],
  args: { name: 'capacity', label: 'Capacity', unitOptions: UNIT_OPTIONS }
}

export const NumberOnly: Story = {
  args: {
    name: 'capacity',
    label: 'Capacity',
    unitOptions: UNIT_OPTIONS,
    hideUnitSelect: true
  }
}

export const Disabled: Story = {
  args: {
    name: 'capacity',
    label: 'Capacity',
    unitOptions: UNIT_OPTIONS,
    disabled: true
  }
}

export const WithError: Story = {
  decorators: [
    withFormProvider(
      {
        capacity: {
          number: undefined,
          unit: { label: undefined, value: undefined }
        }
      },
      { capacity: 'Capacity is required' }
    )
  ],
  args: { name: 'capacity', label: 'Capacity', unitOptions: UNIT_OPTIONS }
}

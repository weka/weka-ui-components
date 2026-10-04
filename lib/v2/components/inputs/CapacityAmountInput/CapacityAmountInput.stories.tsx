import type { CapacityAmountValue } from './CapacityAmountInput'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { FlexBox } from '../../FlexBox'
import { CapacityAmountInput } from './CapacityAmountInput'

const BINARY_STEP = 1024
const MIB = BINARY_STEP * BINARY_STEP
const GIB = MIB * BINARY_STEP
const STORY_WIDTH = 240
const INITIAL_NUMBER = 10

const UNIT_OPTIONS = [
  { label: 'MiB', value: MIB },
  { label: 'GiB', value: GIB }
]

const INITIAL_VALUE: CapacityAmountValue = {
  number: INITIAL_NUMBER,
  unit: { label: 'MiB', value: MIB }
}

interface CapacityAmountInputDemoProps {
  disabled?: boolean
  hideUnitSelect?: boolean
  allowDecimal?: boolean
  placeholder?: string
}

function CapacityAmountInputDemo(
  props: Readonly<CapacityAmountInputDemoProps>
) {
  const [value, setValue] = useState(INITIAL_VALUE)

  return (
    <FlexBox style={{ width: `${STORY_WIDTH}px` }}>
      <CapacityAmountInput
        {...props}
        onChange={setValue}
        unitOptions={UNIT_OPTIONS}
        value={value}
      />
    </FlexBox>
  )
}

const meta: Meta<typeof CapacityAmountInputDemo> = {
  title: 'v2/inputs/CapacityAmountInput',
  component: CapacityAmountInputDemo,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CapacityAmountInputDemo>

export const Default: Story = {}

export const Disabled: Story = { args: { disabled: true } }

export const NumberOnly: Story = { args: { hideUnitSelect: true } }

export const AllowDecimal: Story = { args: { allowDecimal: true } }

export const WithPlaceholder: Story = { args: { placeholder: 'Amount' } }

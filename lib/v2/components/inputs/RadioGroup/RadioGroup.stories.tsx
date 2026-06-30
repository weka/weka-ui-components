import type { RadioGroupDirection } from './RadioGroup'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { NOOP } from '#v2/utils/consts'

import { RadioGroup } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'v2/Inputs/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof RadioGroup>

const OPTIONS = [
  { label: 'Read only', value: 'read' },
  { label: 'Read / write', value: 'write' },
  { label: 'No access', value: 'none' }
]

function ControlledRadioGroup({
  direction
}: Readonly<{ direction?: RadioGroupDirection }>) {
  const [value, setValue] = useState('read')
  return (
    <RadioGroup
      direction={direction}
      onChange={setValue}
      options={OPTIONS}
      value={value}
    />
  )
}

export const Interactive: Story = {
  render: () => <ControlledRadioGroup />
}

export const Inline: Story = {
  render: () => <ControlledRadioGroup direction='row' />
}

export const WithDisabledOption: Story = {
  args: {
    onChange: NOOP,
    options: [
      { label: 'Enabled', value: 'a' },
      { label: 'Disabled', value: 'b', disabled: true }
    ],
    value: 'a'
  }
}

export const DisabledGroup: Story = {
  args: {
    disabled: true,
    onChange: NOOP,
    options: OPTIONS,
    value: 'read'
  }
}

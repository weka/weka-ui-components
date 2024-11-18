import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import Select from './Select'
import { EMPTY_STRING } from 'consts'

const meta: Meta<typeof Select> = {
  title: 'Components/inputs/Select',
  component: Select,
  argTypes: {
    onChange: { action: 'changed' },
    options: { control: 'object' },
    isMulti: { control: 'boolean' },
    disabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    placeholder: { control: 'text' }
  }
}

export default meta

type Story = StoryObj<typeof Select>

interface SelectProps {
  onChange: (newVal: string) => void
  isMulti?: boolean
  sortOptions?: boolean
  disabled?: boolean
  isRequired?: boolean
  options: Option[]
  placeholder?: string
  value?: string | number | string[] | number[]
}

const SelectWithState = (args: SelectProps) => {
  const [selectedValue, setSelectedValue] = useState<SelectProps['value']>(
    args.value || EMPTY_STRING
  )

  const handleChange = (newVal: string) => {
    setSelectedValue(newVal)
    args?.onChange(newVal)
  }

  return (
    <div>
      <Select {...args} value={selectedValue} onChange={handleChange} />
    </div>
  )
}

export const Default: Story = {
  render: (args: SelectProps) => <SelectWithState {...args} />,
  args: {
    options: [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
      { label: 'Option 3', value: 3 },
      { label: 'Option 4', value: 4 }
    ],
    placeholder: 'Select an option',
    label: 'Select Label',
    isMulti: false,
    disabled: false,
    isRequired: true
  }
}

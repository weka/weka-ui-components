import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { NOP } from '#consts'

import { CardRadioGroup } from './CardRadioGroup'

const meta: Meta<typeof CardRadioGroup> = {
  title: 'v2/CardRadioGroup',
  component: CardRadioGroup,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CardRadioGroup>

const OPTIONS = [
  { value: 'full', title: 'Full', description: 'Copies everything.' },
  { value: 'partial', title: 'Partial', description: 'Copies some paths.' },
  { value: 'none', title: 'None', description: 'Copies nothing.' }
]

const OPTIONS_WITH_DISABLED = [
  ...OPTIONS,
  {
    value: 'taken',
    title: 'Taken',
    description: 'Already used by another pair.',
    note: 'Already replicated',
    disabled: true
  }
]

interface CardRadioGroupDemoProps {
  options: typeof OPTIONS
  orientation?: 'horizontal' | 'vertical'
}

function CardRadioGroupDemo({
  options,
  orientation
}: Readonly<CardRadioGroupDemoProps>) {
  const [value, setValue] = useState('full')
  return (
    <CardRadioGroup
      onChange={setValue}
      options={options}
      orientation={orientation}
      value={value}
    />
  )
}

export const Default: Story = {
  render: () => <CardRadioGroupDemo options={OPTIONS} />
}

export const WithDisabledOption: Story = {
  render: () => <CardRadioGroupDemo options={OPTIONS_WITH_DISABLED} />
}

export const Disabled: Story = {
  args: {
    value: 'full',
    options: OPTIONS,
    disabled: true,
    onChange: NOP
  }
}

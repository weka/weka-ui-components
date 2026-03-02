import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'
import { Checkbox } from './CheckBox'

const meta: Meta<typeof Checkbox> = {
  title: 'v2/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    partiallyChecked: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {
  args: {
    checked: false,
    onChange: NOOP
  }
}

export const Checked: Story = {
  args: {
    checked: true,
    onChange: NOOP
  }
}

export const PartiallyChecked: Story = {
  args: {
    checked: false,
    partiallyChecked: true,
    onChange: NOOP
  }
}

export const WithCustomClass: Story = {
  args: {
    checked: true,
    wrapperClass: 'custom-checkbox-class',
    onChange: NOOP
  }
}

export const Interactive: Story = {
  render: function InteractiveCheckbox() {
    const [checked, setChecked] = useState(false)
    return <Checkbox checked={checked} onChange={setChecked} />
  }
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Checkbox checked={false} onChange={NOOP} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Unchecked</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Checkbox checked={true} onChange={NOOP} />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Checked</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Checkbox checked={false} onChange={NOOP} partiallyChecked />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Partial</div>
      </div>
    </div>
  )
}

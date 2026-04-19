import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'

import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'v2/Switch',
  component: Switch,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Switch>

export const Interactive: Story = {
  render: function InteractiveSwitch() {
    const [checked, setChecked] = useState(false)
    return (
      <Switch
        checked={checked}
        onChange={(_, value) => setChecked(value)}
        tooltip='Click to toggle'
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    onChange: NOOP
  }
}

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    onChange: NOOP
  }
}

export const WithTooltip: Story = {
  args: {
    checked: false,
    onChange: NOOP,
    tooltip: 'Toggle this setting to enable the feature'
  }
}

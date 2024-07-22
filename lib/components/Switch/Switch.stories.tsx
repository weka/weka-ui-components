import type { Meta, StoryObj } from 'storybook-solidjs'

import { default as SwitchComponent } from './Switch'
import React, { useState } from 'react'

const meta: Meta<typeof SwitchComponent> = {
  component: SwitchComponent,
  title: 'Components/Switch'
}
export default meta

type Story = StoryObj<typeof SwitchComponent>

const SwitchWithState = (args: object) => {
  const [checked, setChecked] = useState(false)
  const handleOnChange = () => setChecked(!checked)
  return (
    <SwitchComponent checked={checked} onChange={handleOnChange} {...args} />
  )
}

export const Default: Story = {
  args: {},
  render: (args: object) => <SwitchWithState {...args} />
}

import React from 'react'
import type { Meta, StoryObj } from 'storybook-solidjs'

import { EMPTY_STRING } from 'consts'

import { default as NewPasswordTooltipComponent } from './NewPasswordTooltip'

const meta: Meta<typeof NewPasswordTooltipComponent> = {
  component: NewPasswordTooltipComponent,
  title: 'Components/NewPasswordTooltip'
}

export default meta
type Story = StoryObj<typeof NewPasswordTooltipComponent>

export const Default: Story = {
  args: {
    passValue: EMPTY_STRING
  },
  render: (args: object) => <NewPasswordTooltipComponent {...args} />
}

import type { Meta, StoryObj } from 'storybook-solidjs'
import { default as NewPasswordTooltipComponent } from './NewPasswordTooltip'
import React from 'react'
import { EMPTY_STRING } from 'consts'

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

import type { Meta, StoryObj } from '@storybook/react'
import { default as CheckboxComponent } from './Checkbox'

const meta: Meta<typeof CheckboxComponent> = {
  component: CheckboxComponent
}
export default meta

type Story = StoryObj<typeof CheckboxComponent>

export const Default: Story = {}

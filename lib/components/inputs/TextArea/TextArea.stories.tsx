import type { Meta, StoryObj } from '@storybook/react'
import { default as TextAreaComponent } from './TextArea'

const meta: Meta<typeof TextAreaComponent> = {
  component: TextAreaComponent
}
export default meta

type Story = StoryObj<typeof TextAreaComponent>

export const Default: Story = {}

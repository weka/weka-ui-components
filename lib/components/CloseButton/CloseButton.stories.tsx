import type { Meta, StoryObj } from '@storybook/react'
import { default as CloseButtonComponent } from './CloseButton'

const meta: Meta<typeof CloseButtonComponent> = {
  component: CloseButtonComponent,
  title: 'Components/CloseButton'
}
export default meta

type Story = StoryObj<typeof CloseButtonComponent>

export const Default: Story = {}

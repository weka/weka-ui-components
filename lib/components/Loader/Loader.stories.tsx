import type { Meta, StoryObj } from '@storybook/react'
import { default as LoaderComponent } from './Loader'

const meta: Meta<typeof LoaderComponent> = {
  component: LoaderComponent,
  title: 'Components/Loader'
}
export default meta

type Story = StoryObj<typeof LoaderComponent>

export const Default: Story = {}

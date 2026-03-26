import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'v2/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary']
    },
    disabled: { control: 'boolean' },
    isRounded: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    onClick: NOOP
  }
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    onClick: NOOP
  }
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    onClick: NOOP
  }
}

export const NotRounded: Story = {
  args: {
    children: 'Not Rounded',
    isRounded: false,
    onClick: NOOP
  }
}

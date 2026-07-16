import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_STRING, NOOP } from '#v2/utils/consts'

import { LockIcon } from '../../icons/LockIcon'
import { UserIcon } from '../../icons/UserIcon'
import { LoginInput } from './LoginInput'

const meta: Meta<typeof LoginInput> = {
  title: 'v2/LoginInput',
  component: LoginInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    isRequired: { control: 'boolean' },
    disabled: { control: 'boolean' },
    autoFocus: { control: 'boolean' }
  },
  args: {
    onChange: NOOP,
    value: EMPTY_STRING
  },
  render: function InteractiveLoginInput(args) {
    const [value, setValue] = useState(args.value)

    return (
      <LoginInput
        {...args}
        onChange={setValue}
        value={value}
      />
    )
  }
}

export default meta
type Story = StoryObj<typeof LoginInput>

export const UserName: Story = {
  args: {
    placeholder: 'User Name',
    startIcon: <UserIcon />
  }
}

export const Password: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    startIcon: <LockIcon />
  }
}

export const WithError: Story = {
  args: {
    placeholder: 'User Name',
    value: 'j.smith',
    error: 'Invalid credentials',
    startIcon: <UserIcon />
  }
}

export const Disabled: Story = {
  args: {
    placeholder: 'User Name',
    disabled: true,
    startIcon: <UserIcon />
  }
}

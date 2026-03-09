import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING, NOOP } from '../../utils/consts'
import { LoginField } from './LoginField'

const meta: Meta<typeof LoginField> = {
  title: 'v2/LoginField',
  component: LoginField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    type: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    isRequired: { control: 'boolean' },
    disabled: { control: 'boolean' },
    autoFocus: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof LoginField>

export const Default: Story = {
  args: {
    label: 'Email',
    value: EMPTY_STRING,
    onChange: NOOP
  }
}

export const WithValue: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    onChange: NOOP
  }
}

export const Required: Story = {
  args: {
    label: 'Email',
    value: EMPTY_STRING,
    isRequired: true,
    onChange: NOOP
  }
}

export const WithError: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
    onChange: NOOP
  }
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    value: EMPTY_STRING,
    onChange: NOOP
  }
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    value: 'disabled@example.com',
    disabled: true,
    onChange: NOOP
  }
}

export const Interactive: Story = {
  render: function InteractiveLoginField() {
    const [value, setValue] = useState(EMPTY_STRING)
    const [error, setError] = useState(EMPTY_STRING)

    const handleChange = (newValue: string) => {
      setValue(newValue)
      if (newValue && !newValue.includes('@')) {
        setError('Please enter a valid email')
      } else {
        setError(EMPTY_STRING)
      }
    }

    return (
      <LoginField
        label='Email'
        value={value}
        onChange={handleChange}
        error={error}
        isRequired
      />
    )
  }
}

export const LoginForm: Story = {
  render: function LoginFormExample() {
    const [email, setEmail] = useState(EMPTY_STRING)
    const [password, setPassword] = useState(EMPTY_STRING)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '300px'
        }}
      >
        <LoginField
          label='Email'
          value={email}
          onChange={setEmail}
          isRequired
        />
        <LoginField
          label='Password'
          type='password'
          value={password}
          onChange={setPassword}
          isRequired
        />
        <button
          type='button'
          style={{ padding: '12px', cursor: 'pointer' }}
          onClick={() => alert(`Email: ${email}, Password: ${password}`)}
        >
          Sign In
        </button>
      </div>
    )
  }
}

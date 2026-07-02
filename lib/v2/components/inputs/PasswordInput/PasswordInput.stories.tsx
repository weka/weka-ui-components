import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { NOP } from '#consts'
import { EMPTY_STRING } from '#v2/utils/consts'

import { PasswordInput } from './PasswordInput'

const CONTAINER_STYLE: CSSProperties = {
  width: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  color: 'var(--text-primary)'
}

function PasswordInputDemo() {
  const [password, setPassword] = useState(EMPTY_STRING)
  const [newPassword, setNewPassword] = useState(EMPTY_STRING)
  return (
    <div style={CONTAINER_STYLE}>
      <PasswordInput
        autoFocus
        id='password'
        label='Password'
        onChange={setPassword}
        placeholder='Enter password'
        required
        value={password}
      />
      <PasswordInput
        id='new-password'
        label='New Password (with rules)'
        onChange={setNewPassword}
        placeholder='Enter new password'
        required
        showRules
        value={newPassword}
      />
      <PasswordInput
        disabled
        id='disabled'
        label='Disabled'
        onChange={NOP}
        value='cannot edit'
      />
      <PasswordInput
        id='readonly'
        label='Read only'
        onChange={NOP}
        readOnly
        value='look no edits'
      />
    </div>
  )
}

const meta: Meta<typeof PasswordInputDemo> = {
  title: 'v2/Inputs/PasswordInput',
  component: PasswordInputDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}

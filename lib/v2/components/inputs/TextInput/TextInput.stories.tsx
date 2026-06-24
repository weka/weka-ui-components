import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { NOP } from '#consts'
import { EMPTY_STRING } from '#v2/utils/consts'

import { TEXT_INPUT_TYPES, TextInput } from './TextInput'

const CONTAINER_STYLE: CSSProperties = {
  width: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  color: 'var(--text-primary)'
}

function TextInputDemo() {
  const [name, setName] = useState('Jane Doe')
  const [email, setEmail] = useState(EMPTY_STRING)
  const [password, setPassword] = useState(EMPTY_STRING)
  return (
    <div style={CONTAINER_STYLE}>
      <TextInput
        autoFocus
        id='name'
        label='Name (autoFocus + selectOnFocus)'
        onChange={setName}
        placeholder='Jane Doe'
        required
        selectOnFocus
        value={name}
      />
      <TextInput
        id='email'
        label='Email'
        onChange={setEmail}
        placeholder='jane@example.com'
        selectOnFocus
        type={TEXT_INPUT_TYPES.EMAIL}
        value={email}
      />
      <TextInput
        id='password'
        label='Password'
        onChange={setPassword}
        placeholder='********'
        selectOnFocus
        type={TEXT_INPUT_TYPES.PASSWORD}
        value={password}
      />
      <TextInput
        disabled
        id='disabled'
        label='Disabled'
        onChange={NOP}
        value='cannot edit'
      />
      <TextInput
        id='readonly'
        label='Read only'
        onChange={NOP}
        readOnly
        value='look, no edits'
      />
    </div>
  )
}

const meta: Meta<typeof TextInputDemo> = {
  title: 'v2/Inputs/TextInput',
  component: TextInputDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}

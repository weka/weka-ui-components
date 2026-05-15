import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { NOP } from '#consts'
import { EMPTY_STRING } from '#v2/utils/consts'

import { TextArea } from './TextArea'

const CONTAINER_STYLE: CSSProperties = {
  width: '420px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  color: 'var(--text-primary)'
}

const PRE_FILLED_NOTES = `Investigated last week.
Reset succeeded but logs still show retries.
Follow up with platform team.`

function TextAreaDemo() {
  const [description, setDescription] = useState(EMPTY_STRING)
  const [notes, setNotes] = useState(PRE_FILLED_NOTES)
  return (
    <div style={CONTAINER_STYLE}>
      <TextArea
        id='description'
        label='Description'
        onChange={setDescription}
        placeholder='Describe the issue...'
        required
        value={description}
      />
      <TextArea
        id='notes'
        label='Notes'
        onChange={setNotes}
        rows={5}
        value={notes}
      />
      <TextArea
        disabled
        id='disabled'
        label='Disabled'
        onChange={NOP}
        value='Cannot be edited.'
      />
      <TextArea
        id='readonly'
        label='Read only'
        onChange={NOP}
        readOnly
        value='Look, no edits allowed here.'
      />
    </div>
  )
}

const meta: Meta<typeof TextAreaDemo> = {
  title: 'V2/Inputs/TextArea',
  component: TextAreaDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}

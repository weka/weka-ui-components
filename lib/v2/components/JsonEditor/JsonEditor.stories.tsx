import type { JsonEditorCompletionSource, JsonEditorDecoration } from './types'
import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { JsonEditor } from './JsonEditor'

const CONTAINER_STYLE: CSSProperties = {
  width: '560px',
  height: '320px',
  display: 'flex',
  border: '1px solid var(--gray-200-800)',
  color: 'var(--text-primary)'
}

const SAMPLE = `{
  "id": "{{id}}",
  "severity": "{{severity}}",
  "cluster": "{{cluster}}",
  "message": "{{unknown_field}}"
}`

const FIELDS = [
  { key: 'id', detail: 'Unique notification ID' },
  { key: 'severity', detail: 'Alert/Event severity' },
  { key: 'cluster', detail: 'Cluster display name' },
  { key: 'timestamp', detail: 'Trigger time (ISO 8601)' }
]

const KNOWN_KEYS = new Set(FIELDS.map((field) => field.key))

const TEMPLATE_TOKEN = /\{\{\w+\}\}/g
const BRACE_LENGTH = 2

const decorations: JsonEditorDecoration[] = [
  {
    pattern: TEMPLATE_TOKEN,
    className: (match) =>
      KNOWN_KEYS.has(match.slice(BRACE_LENGTH, -BRACE_LENGTH))
        ? 'sb-template-known'
        : 'sb-template-unknown'
  }
]

const completionSource: JsonEditorCompletionSource = ({ textBefore }) => {
  const prefix = /\{\{\w*$/.exec(textBefore)
  if (!prefix) {
    return null
  }
  return {
    from: textBefore.length - prefix[0].length,
    options: FIELDS.map((field) => ({
      label: `{{${field.key}}}`,
      detail: field.detail
    }))
  }
}

function EditableDemo() {
  const [value, setValue] = useState(SAMPLE)
  return (
    <div style={CONTAINER_STYLE}>
      <style>
        {`
        .sb-template-known { color: var(--purple-700-300); font-weight: 600; }
        .sb-template-unknown { color: var(--red-500); text-decoration: underline wavy; }
      `}
      </style>
      <JsonEditor
        completionSource={completionSource}
        decorations={decorations}
        onChange={setValue}
        value={value}
      />
    </div>
  )
}

const READ_ONLY_VALUE = JSON.stringify(
  { status: 'OK', nodes: 12, healthy: true },
  null,
  2
)

const meta: Meta<typeof EditableDemo> = {
  title: 'v2/JsonEditor',
  component: EditableDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Editable: Story = {}

export const ReadOnly: Story = {
  render: () => (
    <div style={CONTAINER_STYLE}>
      <JsonEditor
        maxHeight={280}
        readOnly
        value={READ_ONLY_VALUE}
      />
    </div>
  )
}

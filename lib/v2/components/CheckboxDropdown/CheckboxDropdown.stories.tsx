import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { NOOP } from '#v2/utils/consts'

import { CheckboxDropdown, type CheckboxOption } from './CheckboxDropdown'

const meta: Meta<typeof CheckboxDropdown> = {
  title: 'v2/CheckboxDropdown',
  component: CheckboxDropdown,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CheckboxDropdown>

const WRAPPER_STYLE: CSSProperties = {
  position: 'relative',
  width: 280
}

const CAPTION_STYLE: CSSProperties = {
  marginBottom: 8,
  color: 'var(--text-primary)',
  fontSize: 13
}

const INITIAL_OPTIONS: CheckboxOption[] = [
  { id: 'throughput', label: 'Throughput', checked: true },
  { id: 'iops', label: 'IOPS', checked: true },
  { id: 'latency', label: 'Latency', checked: false },
  { id: 'cpu', label: 'CPU', checked: false },
  { id: 'memory', label: 'Memory', checked: true }
]

function CheckboxDropdownDemo() {
  const [appliedIds, setAppliedIds] = useState<string[]>(
    INITIAL_OPTIONS.filter((option) => option.checked).map(
      (option) => option.id
    )
  )

  const options = INITIAL_OPTIONS.map((option) => ({
    ...option,
    checked: appliedIds.includes(option.id)
  }))

  return (
    <div>
      <div style={CAPTION_STYLE}>
        Applied: {appliedIds.join(', ') || 'none'}
      </div>
      <div style={WRAPPER_STYLE}>
        <CheckboxDropdown
          onApply={setAppliedIds}
          onClose={NOOP}
          options={options}
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <CheckboxDropdownDemo />
}

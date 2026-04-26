import type { Meta, StoryObj } from '@storybook/react'

import { NOOP, SEVERITY_TYPES } from '../../utils/consts'

import { SeverityChip } from './SeverityChip'

const ROW_STYLE = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  flexWrap: 'wrap' as const
}

const meta: Meta<typeof SeverityChip> = {
  title: 'v2/SeverityChip',
  component: SeverityChip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SeverityChip>

export const AllSeverities: Story = {
  render: () => (
    <div style={ROW_STYLE}>
      {Object.values(SEVERITY_TYPES).map((severity) => (
        <SeverityChip
          key={severity}
          severity={severity}
        />
      ))}
    </div>
  )
}

export const Closable: Story = {
  args: {
    severity: SEVERITY_TYPES.WARNING,
    closable: true,
    onClose: NOOP
  }
}

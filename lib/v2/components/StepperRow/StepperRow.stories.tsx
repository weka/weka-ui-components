import type { Meta, StoryObj } from '@storybook/react'

import { StepperRow } from './StepperRow'

const meta: Meta<typeof StepperRow> = {
  title: 'v2/StepperRow',
  component: StepperRow,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof StepperRow>

const listContainerStyle = { width: 360 }

export const List: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <StepperRow
        description='Establishes the peer relationship.'
        label='Create replication link'
        state='done'
        stateLabel='Done'
        stepNumber={1}
      />
      <StepperRow
        description='Copies the initial snapshot.'
        label='Run initial sync'
        state='running'
        stateLabel='Running'
        stepNumber={2}
      />
      <StepperRow
        description='Confirms the pair is healthy.'
        label='Verify replication'
        state='pending'
        stateLabel='Pending'
        stepNumber={3}
      />
    </div>
  )
}

export const WithoutStateLabel: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <StepperRow
        description='Establishes the peer relationship.'
        label='Create replication link'
        stepNumber={1}
      />
    </div>
  )
}

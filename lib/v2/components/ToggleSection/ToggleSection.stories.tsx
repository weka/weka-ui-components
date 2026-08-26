import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { NOOP } from '#v2/utils/consts'

import { ToggleSection } from './ToggleSection'

function ToggleSectionDemo() {
  const [dataReduction, setDataReduction] = useState(false)
  const [qos, setQos] = useState(true)
  return (
    <div>
      <ToggleSection
        checked={dataReduction}
        label='Data Reduction'
        onChange={setDataReduction}
      />
      <ToggleSection
        checked={qos}
        label='QoS Settings'
        labelTooltip='Limits apply per filesystem'
        onChange={setQos}
      >
        <span>Max IOPS / Max Throughput fields go here</span>
      </ToggleSection>
      <ToggleSection
        checked={false}
        disabled
        label='Audit Logging'
        onChange={NOOP}
        showDivider={false}
        switchTooltip='Enable telemetry to use audit logging'
      />
    </div>
  )
}

const meta: Meta<typeof ToggleSectionDemo> = {
  title: 'v2/ToggleSection',
  component: ToggleSectionDemo
}

export default meta
type Story = StoryObj<typeof ToggleSectionDemo>

export const Interactive: Story = {}

import type { Meta, StoryObj } from '@storybook/react'

import { ALLOCATION_SEGMENT_TONES, AllocationBar } from './AllocationBar'

const CLUSTER_SSD_ALLOCATION = 'Cluster SSD Allocation'
const TOTAL_LABEL = '120.8 TB total'
const TOTAL_TB = 120.8
const USED_SEGMENT = {
  id: 'used',
  label: 'Used',
  value: 62.24,
  valueDisplay: '62.24 TB',
  tone: ALLOCATION_SEGMENT_TONES.USED
}

const meta: Meta<typeof AllocationBar> = {
  title: 'v2/AllocationBar',
  component: AllocationBar
}

export default meta
type Story = StoryObj<typeof AllocationBar>

export const Standard: Story = {
  args: {
    label: CLUSTER_SSD_ALLOCATION,
    totalLabel: TOTAL_LABEL,
    total: TOTAL_TB,
    segments: [
      USED_SEGMENT,
      {
        id: 'thisFs',
        label: 'This Filesystem',
        value: 10.21,
        valueDisplay: '10.21 TB',
        tone: ALLOCATION_SEGMENT_TONES.PRIMARY
      },
      {
        id: 'free',
        label: 'Free',
        value: 48.35,
        valueDisplay: '48.35 TB',
        tone: ALLOCATION_SEGMENT_TONES.FREE
      }
    ]
  }
}

export const ThinProvision: Story = {
  args: {
    label: CLUSTER_SSD_ALLOCATION,
    totalLabel: TOTAL_LABEL,
    total: TOTAL_TB,
    segments: [
      USED_SEGMENT,
      {
        id: 'reserved',
        label: 'Reserved SSD',
        value: 10.21,
        valueDisplay: '10.21 TB',
        tone: ALLOCATION_SEGMENT_TONES.PRIMARY
      },
      {
        id: 'maxSsd',
        label: 'Max SSD',
        value: 8.21,
        valueDisplay: '8.21 TB',
        tone: ALLOCATION_SEGMENT_TONES.PRIMARY_LIGHT
      },
      {
        id: 'free',
        label: 'Free',
        value: 40.14,
        valueDisplay: '40.14 TB',
        tone: ALLOCATION_SEGMENT_TONES.FREE
      }
    ]
  }
}

export const OverAllocated: Story = {
  args: {
    label: CLUSTER_SSD_ALLOCATION,
    totalLabel: TOTAL_LABEL,
    total: TOTAL_TB,
    errorMessage:
      'Exceeds free SSD capacity by 3.44 TB. Reduce capacity or enable Thin Provision.',
    segments: [
      USED_SEGMENT,
      {
        id: 'thisFs',
        label: 'This Filesystem',
        value: 62,
        valueDisplay: '62 TB',
        tone: ALLOCATION_SEGMENT_TONES.ERROR
      },
      {
        id: 'free',
        label: 'Free',
        value: 0,
        valueDisplay: '0 TB',
        tone: ALLOCATION_SEGMENT_TONES.FREE
      }
    ]
  }
}

import type {
  CapacityRangeFilterType,
  CapacityUnit
} from './capacityRangeFilterTypes'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { CapacityRangeFilter } from './CapacityRangeFilter'
import { CAPACITY_RANGE_MODES } from './capacityRangeFilterTypes'

const meta: Meta<typeof CapacityRangeFilter> = {
  title: 'v2/Table/filters/CapacityRangeFilter'
}

export default meta
type Story = StoryObj<typeof CapacityRangeFilter>

const GB = 1_000_000_000
const TB = 1_000_000_000_000
const PB = 1_000_000_000_000_000

const UNIT_OPTIONS: CapacityUnit[] = [
  { label: 'GB', value: GB },
  { label: 'TB', value: TB },
  { label: 'PB', value: PB }
]

const CONTAINER_STYLE = {
  width: 260,
  padding: 16,
  background: 'var(--bg-secondary)'
}

const VALUE_STYLE = {
  marginTop: 16,
  color: 'var(--text-primary)',
  fontSize: 12,
  whiteSpace: 'pre-wrap' as const
}

const EMPTY_RANGE = { min: undefined, max: undefined }

function CapacityRangeFilterDemo() {
  const [filter, setFilter] = useState<CapacityRangeFilterType>({
    mode: CAPACITY_RANGE_MODES.USED,
    used: EMPTY_RANGE,
    total: EMPTY_RANGE
  })

  return (
    <div style={CONTAINER_STYLE}>
      <CapacityRangeFilter
        initialValues={filter}
        onChange={setFilter}
        unitOptions={UNIT_OPTIONS}
      />
      <div style={VALUE_STYLE}>{JSON.stringify(filter, null, 2)}</div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <CapacityRangeFilterDemo />
}

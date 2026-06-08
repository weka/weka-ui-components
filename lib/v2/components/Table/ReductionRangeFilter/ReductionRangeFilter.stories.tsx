import type { CapacityUnit } from '../CapacityRangeFilter/capacityRangeFilterTypes'
import type { ReductionRangeFilterType } from './reductionRangeFilterTypes'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { ReductionRangeFilter } from './ReductionRangeFilter'
import { REDUCTION_RANGE_MODES } from './reductionRangeFilterTypes'

const meta: Meta<typeof ReductionRangeFilter> = {
  title: 'v2/Table/filters/ReductionRangeFilter'
}

export default meta
type Story = StoryObj<typeof ReductionRangeFilter>

const GB = 1_000_000_000
const TB = 1_000_000_000_000

const UNIT_OPTIONS: CapacityUnit[] = [
  { label: 'GB', value: GB },
  { label: 'TB', value: TB }
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

function ReductionRangeFilterDemo() {
  const [filter, setFilter] = useState<ReductionRangeFilterType>({
    mode: REDUCTION_RANGE_MODES.RATIO,
    ratio: { min: null, max: null },
    reducedSize: { min: undefined, max: undefined }
  })

  return (
    <div style={CONTAINER_STYLE}>
      <ReductionRangeFilter
        initialValues={filter}
        onChange={setFilter}
        unitOptions={UNIT_OPTIONS}
      />
      <div style={VALUE_STYLE}>{JSON.stringify(filter, null, 2)}</div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <ReductionRangeFilterDemo />
}

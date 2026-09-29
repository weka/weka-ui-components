import type { FilterValue } from '../filterUtils'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { FILTER_TYPES, NOOP } from '#v2/utils/consts'

import { FilterPopover } from './FilterPopover'

const meta: Meta<typeof FilterPopover> = {
  title: 'v2/Table/Filters/FilterPopover'
}

export default meta
type Story = StoryObj<typeof FilterPopover>

const CONTAINER_STYLE = {
  padding: 40,
  background: 'var(--bg-secondary)',
  minHeight: 360
}

const VALUE_STYLE = {
  marginTop: 16,
  color: 'var(--text-primary)',
  fontSize: 13
}

const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'eu-central-1', label: 'eu-central-1' }
]

const DEMO_FILTER_TYPES = {
  MULTISELECT: FILTER_TYPES.MULTISELECT,
  DROPDOWN: FILTER_TYPES.DROPDOWN
} as const

type DemoFilterType = (typeof DEMO_FILTER_TYPES)[keyof typeof DEMO_FILTER_TYPES]

function FilterPopoverDemo({ type }: Readonly<{ type: DemoFilterType }>) {
  const [applied, setApplied] = useState<FilterValue>()

  return (
    <div style={CONTAINER_STYLE}>
      <FilterPopover
        anchorElement={null}
        columnId='region'
        columnName='Region'
        onClose={NOOP}
        onValueChange={setApplied}
        value={applied}
        config={{
          type,
          title: 'Region',
          options: REGIONS
        }}
      />
      <div style={VALUE_STYLE}>Applied: {JSON.stringify(applied ?? null)}</div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <FilterPopoverDemo type={DEMO_FILTER_TYPES.MULTISELECT} />
}

export const Dropdown: Story = {
  render: () => <FilterPopoverDemo type={DEMO_FILTER_TYPES.DROPDOWN} />
}

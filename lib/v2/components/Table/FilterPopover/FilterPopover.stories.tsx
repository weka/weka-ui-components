import type { FilterValue } from '../filterUtils'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_ARRAY, FILTER_TYPES, NOOP } from '#v2/utils/consts'

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

function FilterPopoverDemo() {
  const [applied, setApplied] = useState<FilterValue>(EMPTY_ARRAY)

  return (
    <div style={CONTAINER_STYLE}>
      <FilterPopover
        anchorElement={null}
        columnId='region'
        columnName='Region'
        onClose={NOOP}
        onValueChange={(value) => setApplied(value ?? EMPTY_ARRAY)}
        value={applied}
        config={{
          type: FILTER_TYPES.MULTISELECT,
          title: 'Region',
          options: REGIONS
        }}
      />
      <div style={VALUE_STYLE}>Applied: {JSON.stringify(applied)}</div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <FilterPopoverDemo />
}

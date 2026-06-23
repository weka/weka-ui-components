import type { ActiveFilter } from '../filterUtils'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { FILTER_TYPES } from '#v2/utils/consts'

import { FilterChips } from './FilterChips'

const meta: Meta<typeof FilterChips> = {
  title: 'v2/Table/Filters/FilterChips'
}

export default meta
type Story = StoryObj<typeof FilterChips>

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)'
}

const INITIAL_FILTERS: ActiveFilter[] = [
  {
    columnId: 'region',
    type: FILTER_TYPES.MULTISELECT,
    value: ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1'],
    label: 'Region'
  },
  {
    columnId: 'size',
    type: FILTER_TYPES.NUM_RANGE,
    value: { min: 10, max: null },
    label: 'Size'
  }
]

function FilterChipsDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>(INITIAL_FILTERS)

  return (
    <div style={CONTAINER_STYLE}>
      <FilterChips
        activeFilters={filters}
        onClearAllFilters={() => setFilters([])}
        onRemoveFilter={(columnId) =>
          setFilters((prev) =>
            prev.filter((filter) => filter.columnId !== columnId)
          )
        }
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <FilterChipsDemo />
}

import type { ActiveFilter } from '../filterUtils'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { FILTER_TYPES, NOOP } from '#v2/utils/consts'

import { TableFilter } from './TableFilter'

const meta: Meta<typeof TableFilter> = {
  title: 'v2/Table/filters/TableFilter'
}

export default meta
type Story = StoryObj<typeof TableFilter>

const CONTAINER_STYLE = {
  padding: 40,
  background: 'var(--bg-secondary)',
  minHeight: 320
}

const HEADER_CELL_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  color: 'var(--text-primary)',
  border: '1px solid var(--gray-300-700)',
  width: 240
}

const VALUE_STYLE = {
  marginTop: 16,
  color: 'var(--text-primary)',
  fontSize: 13
}

const COLUMNS = [
  {
    accessorKey: 'region',
    header: 'Region',
    meta: {
      filter: {
        type: FILTER_TYPES.MULTISELECT,
        options: ['us-east-1', 'us-west-2', 'eu-central-1']
      }
    }
  }
]

function TableFilterDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([])

  return (
    <div style={CONTAINER_STYLE}>
      <table>
        <thead>
          <tr>
            <th style={HEADER_CELL_STYLE}>
              Region
              <TableFilter
                activeFilters={filters}
                canFilter
                canSort
                columnId='region'
                columns={COLUMNS}
                onFilterChange={setFilters}
                onSortClick={NOOP}
              />
            </th>
          </tr>
        </thead>
      </table>
      <div style={VALUE_STYLE}>
        Active filters:{' '}
        {filters.length === 0
          ? 'none'
          : filters
              .map(
                (filter) => `${filter.columnId} → ${JSON.stringify(filter.value)}`
              )
              .join(' · ')}
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <TableFilterDemo />
}

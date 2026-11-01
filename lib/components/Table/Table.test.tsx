import type { ExtendedColumnDef, ExtendedColumnFilter } from './types'

import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FILTER_CHANGE_LISTENER } from '#consts'

import Table from './Table'

interface Row {
  name: string
  status: string
}

const LISTENER_PREFIX = 'table-test-'
const STATUS_COLUMN = 'status'
const STATUS_UP = 'UP'
const NAME_COLUMN = 'name'
const NODE_NAME = 'node-1'
const ROWS: Row[] = [
  { name: 'node-1', status: STATUS_UP },
  { name: 'node-2', status: 'DOWN' }
]
const COLUMNS = [
  { accessorKey: NAME_COLUMN, header: 'Name' },
  { accessorKey: STATUS_COLUMN, header: 'Status' }
] as ExtendedColumnDef<unknown, unknown>[]

function dispatchFilterChange(id: string, value: string) {
  document.dispatchEvent(
    new CustomEvent(`${LISTENER_PREFIX}${FILTER_CHANGE_LISTENER}`, {
      detail: { id, value }
    })
  )
}

function StatefulTable({
  onFiltersRendered
}: {
  onFiltersRendered: (filters: unknown) => void
}) {
  const [filters, setFilters] = useState<ExtendedColumnFilter[]>([])
  onFiltersRendered(filters)
  return (
    <Table
      columns={COLUMNS}
      data={ROWS}
      filterCategory='table-test'
      filters={filters}
      listenerPrefix={LISTENER_PREFIX}
      onFiltersChanged={setFilters}
    />
  )
}

describe('Table - controlled filters', () => {
  it('calls onFiltersChanged with the resolved filters array', () => {
    const onFiltersChanged = vi.fn()
    render(
      <MemoryRouter>
        <Table
          columns={COLUMNS}
          data={ROWS}
          filterCategory='table-test'
          filters={[]}
          listenerPrefix={LISTENER_PREFIX}
          onFiltersChanged={onFiltersChanged}
        />
      </MemoryRouter>
    )

    act(() => {
      document.dispatchEvent(
        new CustomEvent(`${LISTENER_PREFIX}${FILTER_CHANGE_LISTENER}`, {
          detail: { id: STATUS_COLUMN, value: STATUS_UP }
        })
      )
    })

    expect(onFiltersChanged).toHaveBeenLastCalledWith([
      { id: STATUS_COLUMN, value: [STATUS_UP] }
    ])
  })

  it('keeps every filter change made in the same batch', () => {
    const onFiltersRendered = vi.fn()
    render(
      <MemoryRouter>
        <StatefulTable onFiltersRendered={onFiltersRendered} />
      </MemoryRouter>
    )

    act(() => {
      dispatchFilterChange(STATUS_COLUMN, STATUS_UP)
      dispatchFilterChange(NAME_COLUMN, NODE_NAME)
    })

    expect(onFiltersRendered).toHaveBeenLastCalledWith([
      { id: STATUS_COLUMN, value: [STATUS_UP] },
      { id: NAME_COLUMN, value: [NODE_NAME] }
    ])
  })
})

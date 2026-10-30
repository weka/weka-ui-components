import type { ExtendedColumnDef } from './types'

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
const ROWS: Row[] = [
  { name: 'node-1', status: STATUS_UP },
  { name: 'node-2', status: 'DOWN' }
]
const COLUMNS = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: STATUS_COLUMN, header: 'Status' }
] as ExtendedColumnDef<unknown, unknown>[]

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
})

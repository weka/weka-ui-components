import type { ColumnDef } from '@tanstack/react-table'

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Table } from './Table'

interface Item {
  id: number
  name: string
}

const COLUMNS: ColumnDef<Item>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' }
]

const WRAPPER_SELECTOR = '[class*="customTableWrapper"]'
const COMPACT_CLASS = 'compactTable'
const PAGE_SIZE = 50
const TOTAL_ITEMS = 55

const makeRows = (count: number): Item[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`
  }))

const getWrapper = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(WRAPPER_SELECTOR)

describe('Table compact height', () => {
  it('shrinks to fit a partial last page in manual pagination', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        currentPage={2}
        data={makeRows(TOTAL_ITEMS - PAGE_SIZE)}
        fixedPageSize={PAGE_SIZE}
        itemsAmount={TOTAL_ITEMS}
        manualPagination
      />
    )
    expect(getWrapper(container)?.className).toContain(COMPACT_CLASS)
  })

  it('keeps full height on a full page in manual pagination', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        currentPage={1}
        data={makeRows(PAGE_SIZE)}
        fixedPageSize={PAGE_SIZE}
        itemsAmount={TOTAL_ITEMS}
        manualPagination
      />
    )
    expect(getWrapper(container)?.className).not.toContain(COMPACT_CLASS)
  })
})

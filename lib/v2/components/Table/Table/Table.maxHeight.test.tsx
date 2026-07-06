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

const DATA: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]

const WRAPPER_SELECTOR = '[class*="customTableWrapper"]'
const CAPPED_CLASS = 'cappedTable'
const MAX_HEIGHT = 300
const MAX_HEIGHT_STYLE = `${MAX_HEIGHT}px`

const getWrapper = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(WRAPPER_SELECTOR)

describe('Table maxHeight', () => {
  it('caps the wrapper instead of filling the parent when maxHeight is set', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        maxHeight={MAX_HEIGHT}
      />
    )
    const wrapper = getWrapper(container)
    expect(wrapper?.className).toContain(CAPPED_CLASS)
    expect(wrapper?.style.maxHeight).toBe(MAX_HEIGHT_STYLE)
  })

  it('does not cap the wrapper when maxHeight is not set', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
      />
    )
    expect(getWrapper(container)?.className).not.toContain(CAPPED_CLASS)
  })

  it('keeps the full-height scroll viewport in endless mode even with maxHeight', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        endless
        hasMore={false}
        maxHeight={MAX_HEIGHT}
      />
    )
    const wrapper = getWrapper(container)
    expect(wrapper?.className).not.toContain(CAPPED_CLASS)
    expect(wrapper?.style.maxHeight).toBe(MAX_HEIGHT_STYLE)
  })
})

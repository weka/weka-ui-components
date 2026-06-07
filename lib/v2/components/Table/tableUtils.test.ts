import type { ColumnDef, Header } from '@tanstack/react-table'

import { describe, expect, it } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import {
  buildTableColumns,
  extractColumnIds,
  getCanShowFilter,
  isSortableColumn
} from './tableUtils'

interface Row {
  name: string
  region: string
}

describe('isSortableColumn', () => {
  it('is sortable when it has an id and sorting is not disabled', () => {
    expect(isSortableColumn<Row>({ accessorKey: 'name' })).toBe(true)
    expect(isSortableColumn<Row>({ id: 'name' })).toBe(true)
  })

  it('is not sortable when sorting is explicitly disabled', () => {
    expect(
      isSortableColumn<Row>({ accessorKey: 'name', enableSorting: false })
    ).toBe(false)
  })

  it('is not sortable when no id can be resolved', () => {
    expect(isSortableColumn<Row>({ header: 'Name' })).toBe(false)
  })
})

describe('extractColumnIds', () => {
  it('collects resolvable ids and drops columns without one', () => {
    const columns: ColumnDef<Row>[] = [
      { accessorKey: 'name' },
      { id: 'region' },
      { header: 'Actions' }
    ]
    expect(extractColumnIds(columns)).toEqual(['name', 'region'])
  })
})

describe('buildTableColumns', () => {
  it('enables sorting, filtering, and resizing by default', () => {
    const [column] = buildTableColumns<Row>([{ accessorKey: 'name' }], true)
    expect(column.enableSorting).toBe(true)
    expect(column.enableColumnFilter).toBe(true)
    expect(column.enableResizing).toBe(true)
  })

  it('honors explicit per-column opt-outs', () => {
    const [column] = buildTableColumns<Row>(
      [
        { accessorKey: 'name', enableSorting: false, enableColumnFilter: false }
      ],
      true
    )
    expect(column.enableSorting).toBe(false)
    expect(column.enableColumnFilter).toBe(false)
  })

  it('disables resizing for every column when resizing is off', () => {
    const [column] = buildTableColumns<Row>([{ accessorKey: 'name' }], false)
    expect(column.enableResizing).toBe(false)
  })
})

function makeHeader(
  canFilter: boolean,
  meta?: Record<string, unknown>
): Header<Row, unknown> {
  return {
    column: {
      columnDef: { meta },
      getCanFilter: () => canFilter
    }
  } as unknown as Header<Row, unknown>
}

describe('getCanShowFilter', () => {
  it('defers to the column when there is no meta', () => {
    expect(getCanShowFilter(makeHeader(true))).toBe(true)
    expect(getCanShowFilter(makeHeader(false))).toBe(false)
  })

  it('hides the filter when the column cannot be filtered', () => {
    expect(
      getCanShowFilter(makeHeader(false, { filter: { type: 'text' } }))
    ).toBe(false)
  })

  it('shows a multiselect filter only when it has options', () => {
    const withOptions = makeHeader(true, {
      filter: { type: FILTER_TYPES.MULTISELECT, options: ['a', 'b'] }
    })
    const withFixedOptions = makeHeader(true, {
      filter: {
        type: FILTER_TYPES.MULTISELECT,
        options: { fixedOptions: ['a'] }
      }
    })
    const withoutOptions = makeHeader(true, {
      filter: { type: FILTER_TYPES.MULTISELECT, options: [] }
    })

    expect(getCanShowFilter(withOptions)).toBe(true)
    expect(getCanShowFilter(withFixedOptions)).toBe(true)
    expect(getCanShowFilter(withoutOptions)).toBe(false)
  })

  it('shows non-multiselect filters that the column allows', () => {
    expect(
      getCanShowFilter(makeHeader(true, { filter: { type: 'text' } }))
    ).toBe(true)
  })
})

import type { ColumnDef, Header } from '@tanstack/react-table'

import { describe, expect, it } from 'vitest'

import { FILTER_TYPES } from '#v2/utils/consts'

import {
  buildTableColumns,
  extractColumnIds,
  getCanShowFilter,
  getColumnWidth,
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

describe('getColumnWidth', () => {
  const ACTIONS_ID = '__rowActions__'
  const ACTIONS_WIDTH = 40
  const NAME_SIZE = 200
  const VALUE_SIZE = 100
  const PROPORTIONAL_TOTAL = 300

  const makeCol = (id: string, size: number) =>
    ({ id, getSize: () => size } as unknown as Parameters<
      typeof getColumnWidth
    >[0])

  const ctx = {
    actionsColumnId: ACTIONS_ID,
    reservedWidth: ACTIONS_WIDTH,
    proportionalTotal: PROPORTIONAL_TOTAL
  }

  it('keeps the actions column at its fixed pixel size', () => {
    expect(getColumnWidth(makeCol(ACTIONS_ID, ACTIONS_WIDTH), ctx)).toBe(
      ACTIONS_WIDTH
    )
  })

  it('gives each data column a proportional share of the space left after the reserved width', () => {
    expect(getColumnWidth(makeCol('name', NAME_SIZE), ctx)).toBe(
      'calc((100% - 40px) * 0.666667)'
    )
    expect(getColumnWidth(makeCol('value', VALUE_SIZE), ctx)).toBe(
      'calc((100% - 40px) * 0.333333)'
    )
  })

  it('falls back to the raw size when there are no proportional columns', () => {
    expect(
      getColumnWidth(makeCol('name', NAME_SIZE), { ...ctx, proportionalTotal: 0 })
    ).toBe(NAME_SIZE)
  })
})

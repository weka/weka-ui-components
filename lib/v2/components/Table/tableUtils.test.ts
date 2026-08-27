import type {
  ColumnDef,
  Header,
  Row as TanstackRow
} from '@tanstack/react-table'

import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'
import { FILTER_TYPES } from '#v2/utils/consts'

import {
  buildTableColumns,
  extractColumnIds,
  getCanShowFilter,
  isSortableColumn,
  multiSelectFilterFn,
  textFilterFn
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

function rowWithValue(value: unknown): TanstackRow<Row> {
  return { getValue: () => value } as unknown as TanstackRow<Row>
}

describe('multiSelectFilterFn', () => {
  it('passes every row when the filter is empty or not an array', () => {
    expect(multiSelectFilterFn(rowWithValue('a'), 'region', [])).toBe(true)
    expect(multiSelectFilterFn(rowWithValue('a'), 'region', undefined)).toBe(
      true
    )
  })

  it('passes only rows whose value is among the selected options', () => {
    expect(multiSelectFilterFn(rowWithValue('a'), 'region', ['a', 'b'])).toBe(
      true
    )
    expect(multiSelectFilterFn(rowWithValue('c'), 'region', ['a', 'b'])).toBe(
      false
    )
  })
})

describe('textFilterFn', () => {
  it('passes every row when the filter is empty', () => {
    expect(textFilterFn(rowWithValue('abc'), 'name', undefined)).toBe(true)
    expect(textFilterFn(rowWithValue('abc'), 'name', null)).toBe(true)
    expect(textFilterFn(rowWithValue('abc'), 'name', EMPTY_STRING)).toBe(true)
  })

  it('matches case-insensitively by substring', () => {
    expect(textFilterFn(rowWithValue('Frontend'), 'name', 'front')).toBe(true)
    expect(textFilterFn(rowWithValue('Frontend'), 'name', 'back')).toBe(false)
  })

  it('matches numeric cells by their stringified value', () => {
    expect(textFilterFn(rowWithValue(1000), 'name', '100')).toBe(true)
    expect(textFilterFn(rowWithValue(1000), 'name', '205')).toBe(false)
  })
})

describe('buildTableColumns filterFn defaults', () => {
  it('assigns the multiSelect predicate for multiSelect filter meta', () => {
    const [column] = buildTableColumns<Row>(
      [
        {
          accessorKey: 'region',
          meta: { filter: { type: FILTER_TYPES.MULTISELECT } }
        }
      ],
      true
    )
    expect(column.filterFn).toBe(multiSelectFilterFn)
  })

  it('assigns the text predicate for text filter meta', () => {
    const [column] = buildTableColumns<Row>(
      [{ accessorKey: 'name', meta: { filter: { type: FILTER_TYPES.TEXT } } }],
      true
    )
    expect(column.filterFn).toBe(textFilterFn)
  })

  it('keeps an explicit column filterFn over the type default', () => {
    const explicitFilterFn = () => true
    const [column] = buildTableColumns<Row>(
      [
        {
          accessorKey: 'region',
          filterFn: explicitFilterFn,
          meta: { filter: { type: FILTER_TYPES.MULTISELECT } }
        }
      ],
      true
    )
    expect(column.filterFn).toBe(explicitFilterFn)
  })

  it('assigns no default for columns without filter meta or with range types', () => {
    const [plainColumn, rangeColumn] = buildTableColumns<Row>(
      [
        { accessorKey: 'name' },
        {
          accessorKey: 'region',
          meta: {
            filter: { type: FILTER_TYPES.NUM_RANGE }
          } as unknown as ColumnDef<Row>['meta']
        }
      ],
      true
    )
    expect(plainColumn.filterFn).toBeUndefined()
    expect(rangeColumn.filterFn).toBeUndefined()
  })
})

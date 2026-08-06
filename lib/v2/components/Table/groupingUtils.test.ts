import type { Cell, ColumnDef, Row, TableOptions } from '@tanstack/react-table'

import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'

import {
  getGroupedCellMode,
  getGroupUniqueCount,
  GROUPED_CELL_MODES
} from './groupingUtils'

interface Namespace {
  tenant: string
  nameSpace: string
  host: string
}

const GROUPING = ['tenant']

const COLUMNS: ColumnDef<Namespace>[] = [
  { accessorKey: 'tenant', header: 'Tenant' },
  { accessorKey: 'nameSpace', header: 'Namespace' },
  { accessorKey: 'host', header: 'Host' }
]

const DATA: Namespace[] = [
  { tenant: 'alpha', nameSpace: 'ns-1', host: 'host-1' },
  { tenant: 'alpha', nameSpace: 'ns-2', host: 'host-1' },
  { tenant: 'beta', nameSpace: 'ns-3', host: EMPTY_STRING }
]

function renderGroupRows(): Row<Namespace>[] {
  const { result } = renderHook(() =>
    useReactTable<Namespace>({
      data: DATA,
      columns: COLUMNS,
      initialState: { grouping: GROUPING, expanded: true },
      getCoreRowModel: getCoreRowModel(),
      getGroupedRowModel: getGroupedRowModel(),
      getExpandedRowModel: getExpandedRowModel()
    } as TableOptions<Namespace>)
  )

  return result.current.getGroupedRowModel().rows
}

const findGroup = (rows: Row<Namespace>[], tenant: string) =>
  rows.find((row) => row.getValue('tenant') === tenant) as Row<Namespace>

const findCell = (row: Row<Namespace>, columnId: string) =>
  row.getAllCells().find((cell) => cell.column.id === columnId) as Cell<
    Namespace,
    unknown
  >

describe('getGroupedCellMode', () => {
  const alphaGroup = findGroup(renderGroupRows(), 'alpha')

  it('marks the grouping column of a group row as the group cell', () => {
    expect(getGroupedCellMode(findCell(alphaGroup, 'tenant'))).toBe(
      GROUPED_CELL_MODES.GROUP
    )
  })

  it('marks the remaining columns of a group row as aggregated', () => {
    expect(getGroupedCellMode(findCell(alphaGroup, 'nameSpace'))).toBe(
      GROUPED_CELL_MODES.AGGREGATED
    )
  })

  it('marks the grouping column of a leaf row as a placeholder', () => {
    expect(getGroupedCellMode(findCell(alphaGroup.subRows[0], 'tenant'))).toBe(
      GROUPED_CELL_MODES.PLACEHOLDER
    )
  })

  it('marks the remaining columns of a leaf row as plain values', () => {
    expect(
      getGroupedCellMode(findCell(alphaGroup.subRows[0], 'nameSpace'))
    ).toBe(GROUPED_CELL_MODES.VALUE)
  })
})

describe('getGroupUniqueCount', () => {
  const groupRows = renderGroupRows()

  it('counts every distinct value across the leaf rows', () => {
    expect(
      getGroupUniqueCount(findGroup(groupRows, 'alpha'), 'nameSpace')
    ).toBe(2)
  })

  it('collapses repeated values into a single count', () => {
    expect(getGroupUniqueCount(findGroup(groupRows, 'alpha'), 'host')).toBe(1)
  })

  it('ignores empty values', () => {
    expect(getGroupUniqueCount(findGroup(groupRows, 'beta'), 'host')).toBe(0)
  })
})

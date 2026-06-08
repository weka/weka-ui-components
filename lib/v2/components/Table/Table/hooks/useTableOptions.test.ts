import type { ColumnDef } from '@tanstack/react-table'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableOptions } from './useTableOptions'

interface Row {
  name: string
}

const COLUMNS: ColumnDef<Row>[] = [{ accessorKey: 'name' }]

function setup(manualPagination: boolean) {
  return renderHook(() =>
    useTableOptions<Row>({
      displayData: [{ name: 'a' }],
      tableColumns: COLUMNS,
      sorting: [],
      setSorting: vi.fn(),
      columnFilters: [],
      setColumnFilters: vi.fn(),
      columnVisibility: {},
      handleColumnVisibilityChange: vi.fn(),
      columnResizeMode: 'onChange',
      hasResizableColumns: true,
      currentPage: 2,
      effectivePageSize: 25,
      manualSorting: false,
      manualPagination
    })
  )
}

describe('useTableOptions', () => {
  it('maps the 1-based current page to a 0-based pageIndex', () => {
    const { result } = setup(false)
    expect(result.current.state.pagination).toEqual({
      pageIndex: 1,
      pageSize: 25
    })
  })

  it('uses a client pagination row model when pagination is not manual', () => {
    const { result } = setup(false)
    expect('getPaginationRowModel' in result.current).toBe(true)
    expect('manualPagination' in result.current).toBe(false)
  })

  it('switches to manual pagination with an unknown page count', () => {
    const { result } = setup(true)
    const options = result.current as typeof result.current & {
      manualPagination?: boolean
      pageCount?: number
    }
    expect(options.manualPagination).toBe(true)
    expect(options.pageCount).toBe(-1)
  })
})

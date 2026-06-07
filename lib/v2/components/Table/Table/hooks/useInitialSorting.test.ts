import type { ColumnDef } from '@tanstack/react-table'

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useInitialSorting } from './useInitialSorting'

interface Row {
  name: string
  region: string
}

const COLUMNS: ColumnDef<Row>[] = [
  { accessorKey: 'name' },
  { accessorKey: 'region' }
]

describe('useInitialSorting', () => {
  it('uses the explicit default sort column and direction', () => {
    const { result } = renderHook(() =>
      useInitialSorting('region', 'desc', COLUMNS)
    )
    expect(result.current.sorting).toEqual([{ id: 'region', desc: true }])
  })

  it('falls back to the first sortable column', () => {
    const { result } = renderHook(() =>
      useInitialSorting(undefined, 'asc', COLUMNS)
    )
    expect(result.current.sorting).toEqual([{ id: 'name', desc: false }])
  })

  it('skips columns with sorting disabled when choosing a fallback', () => {
    const columns: ColumnDef<Row>[] = [
      { accessorKey: 'name', enableSorting: false },
      { accessorKey: 'region' }
    ]
    const { result } = renderHook(() =>
      useInitialSorting(undefined, 'asc', columns)
    )
    expect(result.current.sorting).toEqual([{ id: 'region', desc: false }])
  })

  it('returns no sorting when no column is sortable', () => {
    const { result } = renderHook(() =>
      useInitialSorting(undefined, 'asc', [{ header: 'Actions' }])
    )
    expect(result.current.sorting).toEqual([])
  })
})

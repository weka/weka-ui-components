import type { ColumnDef } from '@tanstack/react-table'

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  deriveDefaultVisibility,
  useColumnVisibility
} from './useColumnVisibility'

interface Row {
  name: string
  region: string
  notes: string
}

const COLUMNS: ColumnDef<Row>[] = [
  { accessorKey: 'name' },
  { accessorKey: 'region' },
  { accessorKey: 'notes', meta: { defaultHidden: true } }
]

describe('deriveDefaultVisibility', () => {
  it('returns an empty map when no column is hidden by default', () => {
    expect(deriveDefaultVisibility<Row>([{ accessorKey: 'name' }])).toEqual({})
  })

  it('marks defaultHidden columns invisible and the rest visible', () => {
    expect(deriveDefaultVisibility(COLUMNS)).toEqual({
      name: true,
      region: true,
      notes: false
    })
  })
})

describe('useColumnVisibility', () => {
  it('seeds from initialColumnVisibility when provided', () => {
    const { result } = renderHook(() =>
      useColumnVisibility({
        columns: COLUMNS,
        initialColumnVisibility: { notes: true }
      })
    )
    expect(result.current.columnVisibility).toEqual({ notes: true })
  })

  it('falls back to defaultHidden-derived visibility', () => {
    const { result } = renderHook(() =>
      useColumnVisibility({ columns: COLUMNS })
    )
    expect(result.current.columnVisibility).toEqual({
      name: true,
      region: true,
      notes: false
    })
  })

  it('reports changes through onColumnVisibilityChange', () => {
    const onColumnVisibilityChange = vi.fn()
    const { result } = renderHook(() =>
      useColumnVisibility({
        columns: COLUMNS,
        initialColumnVisibility: {},
        onColumnVisibilityChange
      })
    )

    act(() => {
      result.current.handleColumnVisibilityChange({ name: false })
    })

    expect(result.current.columnVisibility).toEqual({ name: false })
    expect(onColumnVisibilityChange).toHaveBeenCalledWith({ name: false })
  })

  it('supports updater-function changes', () => {
    const onColumnVisibilityChange = vi.fn()
    const { result } = renderHook(() =>
      useColumnVisibility({
        columns: COLUMNS,
        initialColumnVisibility: { name: true },
        onColumnVisibilityChange
      })
    )

    act(() => {
      result.current.handleColumnVisibilityChange((prev) => ({
        ...prev,
        region: false
      }))
    })

    expect(result.current.columnVisibility).toEqual({
      name: true,
      region: false
    })
    expect(onColumnVisibilityChange).toHaveBeenCalledWith({
      name: true,
      region: false
    })
  })
})

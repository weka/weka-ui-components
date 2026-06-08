import type { ColumnDef } from '@tanstack/react-table'

import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useGlobalSearch } from './useGlobalSearch'

interface Row {
  name: string
  region: string
  secret: string
}

const COLUMNS: ColumnDef<Row>[] = [
  { accessorKey: 'name' },
  { accessorKey: 'region' }
]

const DATA: Row[] = [
  { name: 'alpha-cluster', region: 'us-east-1', secret: 'token-xyz' },
  { name: 'beta-cluster', region: 'eu-central-1', secret: 'token-abc' }
]

function search(term: string, excluded: string[] = []) {
  const { result } = renderHook(() => useGlobalSearch(DATA, COLUMNS, excluded))
  act(() => result.current.handleGlobalSearch(term))
  return result
}

describe('useGlobalSearch', () => {
  it('returns all rows below the minimum search length', () => {
    const result = search('a')
    expect(result.current.filteredData).toEqual(DATA)
  })

  it('matches a name column', () => {
    const result = search('alpha')
    expect(result.current.filteredData).toEqual([DATA[0]])
  })

  it('matches any string field by default', () => {
    const result = search('central')
    expect(result.current.filteredData).toEqual([DATA[1]])
  })

  it('does not match excluded fields', () => {
    const result = search('token-xyz', ['secret'])
    expect(result.current.filteredData).toEqual([])
  })

  it('matches a non-excluded field even when another field is excluded', () => {
    const result = search('alpha', ['secret'])
    expect(result.current.filteredData).toEqual([DATA[0]])
  })
})

import type { ColumnDef } from '@tanstack/react-table'

import { useMemo, useState } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

const MIN_SEARCH_LENGTH = 2
const NAME_COLUMN_IDS = ['filename', 'clusterName']

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function getColumnAccessor<TData>(col: ColumnDef<TData>): string | undefined {
  return col.id || (col as { accessorKey?: string }).accessorKey
}

function isNameColumn<TData>(col: ColumnDef<TData>): boolean {
  const columnId = getColumnAccessor(col)
  if (!columnId) {
    return false
  }
  return (
    columnId.toLowerCase().includes('name') ||
    NAME_COLUMN_IDS.includes(columnId)
  )
}

/**
 * Client-side global search: matches name-like columns first, then any string
 * field that isn't excluded. Returns the full data set until the term reaches
 * the minimum length.
 */
export function useGlobalSearch<TData>(
  data: TData[],
  columns: ColumnDef<TData>[],
  searchExcludedFields: string[]
) {
  const [globalSearchTerm, setGlobalSearchTerm] = useState(EMPTY_STRING)

  const filteredData = useMemo(() => {
    const trimmedSearchTerm = globalSearchTerm.trim()
    if (!trimmedSearchTerm || trimmedSearchTerm.length < MIN_SEARCH_LENGTH) {
      return data
    }

    const searchTerm = trimmedSearchTerm.toLowerCase()
    const nameColumns = columns.filter(isNameColumn)
    const excludedFieldsSet = new Set(searchExcludedFields)

    const matchesNameColumn = (row: TData): boolean =>
      nameColumns.some((col) => {
        const columnId = getColumnAccessor(col)
        if (!columnId) {
          return false
        }
        const value = (row as Record<string, unknown>)[columnId]
        return (
          isNonEmptyString(value) && value.toLowerCase().includes(searchTerm)
        )
      })

    const matchesAnyField = (row: TData): boolean =>
      Object.entries(row as Record<string, unknown>).some(
        ([key, value]) =>
          !excludedFieldsSet.has(key) &&
          isNonEmptyString(value) &&
          value.toLowerCase().includes(searchTerm)
      )

    return data.filter((row) => matchesNameColumn(row) || matchesAnyField(row))
  }, [data, globalSearchTerm, columns, searchExcludedFields])

  const handleGlobalSearch = (searchTerm: string) => {
    setGlobalSearchTerm(searchTerm)
  }

  return { filteredData, globalSearchTerm, handleGlobalSearch }
}

import { useCallback, useMemo } from 'react'
import type { ExtendedColumn, ExtendedColumnDefWithId } from '../types'
import type { VisibilityState } from '@tanstack/react-table'
import localStorageService from '../../../localStorageService'
import { SAVED_HIDDEN } from '../../../consts'

function useHiddenColumns<Values extends Record<string, unknown>>({
  columns,
  filterCategory
}: {
  columns: ExtendedColumnDefWithId<Values>[]
  filterCategory: string
}) {
  const hiddenInLocalStorage = useMemo(() => {
    const LSHidden = localStorageService.getItem(SAVED_HIDDEN)
    const hiddenInLocalStorageArr =
      (LSHidden && (JSON.parse(LSHidden)[filterCategory] as string[])) ||
      columns.filter(({ meta }) => meta?.defaultHidden).map(({ id }) => id)

    return hiddenInLocalStorageArr.reduce<Record<string, boolean>>(
      (acc, curr) => {
        acc[curr] = false
        return acc
      },
      {}
    )
  }, [columns, filterCategory])

  const onVisibilityChange = useCallback(
    (
      allColumns: ExtendedColumn<Values>[],
      columnVisibility: VisibilityState
    ) => {
      const hiddenColumns = allColumns
        .filter(({ id }) => columnVisibility[id] === false)
        .map(({ id }) => id)

      localStorageService.updateHidden(filterCategory, hiddenColumns)
    },
    [filterCategory]
  )

  return {
    hiddenInLocalStorage,
    onVisibilityChange
  }
}

export default useHiddenColumns

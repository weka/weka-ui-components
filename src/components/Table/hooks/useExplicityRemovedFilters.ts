import { useState } from 'react'
import { EXPLICITLY_REMOVED_FILTERS } from '../../../consts'
import localStorageService from '../../../localStorageService'
import { ExtendedColumnFilter } from '../types'

/**
 * Keeps track of user-removed **default** filters
 */
function useExplicitlyRemovedFilters(
  initialUserFilters?: ExtendedColumnFilter[]
) {
  const [explicitlyRemovedFilters, setExplicitlyRemovedFilters] = useState<
    Set<string>
  >(() => {
    if (!initialUserFilters) {
      return new Set()
    }

    const LSValue = localStorageService.getItem(EXPLICITLY_REMOVED_FILTERS)
    return new Set(LSValue ? JSON.parse(LSValue) : [])
  })

  const handleFiltersUpdate = (filters: ExtendedColumnFilter[]) => {
    if (!initialUserFilters) {
      return
    }

    const activeFilters = new Set(filters.map(({ id }) => id))
    const removedFilters: string[] = []

    initialUserFilters.forEach(({ id }) => {
      if (!activeFilters.has(id)) {
        removedFilters.push(id)
      }
    })

    localStorageService.setItem(
      EXPLICITLY_REMOVED_FILTERS,
      JSON.stringify(removedFilters)
    )

    setExplicitlyRemovedFilters(new Set(removedFilters))
  }

  return [explicitlyRemovedFilters, handleFiltersUpdate] as const
}

export default useExplicitlyRemovedFilters

import { useCallback, useEffect } from 'react'
import { ExtendedColumnFilter, ExtendedTable } from '../types'
import { FILTER_CHANGE_LISTENER, FILTER_LISTENER } from '../../../consts'
import { Utils } from '../../../main'

interface ExtendedEvent extends Event {
  detail: {
    value: any
    id: any
  }
}

/**
 * Listens for custom DOM events that add or remove filters
 */
function useExplicitlyRemovedFilters<Data>({
  columnFilters,
  table,
  listenerPrefix
}: {
  columnFilters: ExtendedColumnFilter[]
  table: ExtendedTable<Data>
  listenerPrefix?: string
}) {
  const addOrRemoveFromFilter = useCallback(
    (event: ExtendedEvent) => {
      const { value, id } = event.detail
      const findFilter =
        columnFilters.find((filter) => filter.id === id)?.value || []
      const newFilter = Array.isArray(findFilter)
        ? [...findFilter]
        : [findFilter]
      if (!newFilter?.includes(value)) {
        newFilter.push(value)
      } else {
        newFilter.splice(newFilter.indexOf(value), 1)
      }
      table.setColumnFilters((prev) => {
        const newFiltersArr = [...prev.filter((filter) => filter.id !== id)]

        return newFilter.length
          ? [...newFiltersArr, { id, value: newFilter }]
          : newFiltersArr
      })
    },
    [columnFilters, table]
  )

  useEffect(() => {
    if (listenerPrefix) {
      document.addEventListener(
        `${listenerPrefix}${FILTER_CHANGE_LISTENER}`,
        addOrRemoveFromFilter as EventListener
      )

      Utils.dispatchCustomEvent(
        `${listenerPrefix}${FILTER_LISTENER}`,
        columnFilters
      )

      return () => {
        document.removeEventListener(
          `${listenerPrefix}${FILTER_CHANGE_LISTENER}`,
          addOrRemoveFromFilter as EventListener
        )
      }
    }
  }, [addOrRemoveFromFilter, columnFilters, listenerPrefix])
}

export default useExplicitlyRemovedFilters

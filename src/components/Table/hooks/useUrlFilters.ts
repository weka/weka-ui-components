import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SAVED_FILTERS } from '../../../consts'
import localStorageService from '../../../localStorageService'
import utils from '../../../utils'

const parseSearchParams = (searchParams: URLSearchParams) =>
  [...searchParams].reduce<Record<string, string[] | Record<string, string[]>>>(
    (acc, [key, value]) => {
      const matchedObj = key.match(/([A-z_-]+)\[([A-z_-]+)\]/)
      if (matchedObj) {
        const [, objName, objKey] = matchedObj

        if (!acc[objName]) acc[objName] = {}
        if (!acc[objName][objKey]) acc[objName][objKey] = []

        acc[objName][objKey].push(value)
      } else if (!acc[key] || Array.isArray(acc[key])) {
        if (!acc[key]) acc[key] = []
        acc[key].push(value)
      }

      return acc
    },
    {}
  )

export const useUrlFilters = ({
  enabled = true,
  filterIds,
  initial,
  filterCategory
}: {
  enabled?: boolean
  filterIds: string[]
  initial?: Filter[]
  filterCategory: string
}) => {
  const getLocalStorageFilters = (): Record<Filter['id'], Filter['value']> => {
    const LSFilters = localStorageService.getItem(SAVED_FILTERS)
    return (LSFilters && JSON.parse(LSFilters)[filterCategory]) || {}
  }

  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filter[]>(() => {
    if (!enabled) return []
    if (initial) return initial

    const parsedSearchParams = window.location.search
      ? parseSearchParams(searchParams)
      : getLocalStorageFilters()

    return filterIds.flatMap((column) => {
      const filterValue = parsedSearchParams[column]
      return filterValue ? { id: column, value: filterValue } : []
    })
  })

  const setUrlFilters = (filters: Filter[]) => {
    filterIds.forEach((column) => {
      searchParams.delete(column)
    })

    filters.forEach(({ id, value }) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val) {
            searchParams.append(id, val)
          }
        })
      } else if (utils.isObject(value)) {
        Object.entries(value).forEach(([innerKey, innerVal]) => {
          searchParams.append(`${id}[${innerKey}]`, innerVal.toString())
        })
      } else if (!utils.isEmpty(value)) {
        searchParams.append(id, value)
      }
    })

    setFilters(filters)

    setSearchParams(parseSearchParams(searchParams))

    const filtersObj = filters.reduce(
      (acc: { [key: string]: any }, { id, value }) => {
        acc[id] = value
        return acc
      },
      {}
    )
    localStorageService.updateFilters(filterCategory, filtersObj)
  }

  useEffect(() => {
    if (enabled) {
      setUrlFilters(filters)
    }
  }, [enabled])

  return [filters, setUrlFilters] as const
}

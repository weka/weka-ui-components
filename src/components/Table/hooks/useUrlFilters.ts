import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utils } from '../../..'
import { SAVED_FILTERS } from '../../../consts'
import localStorageService from '../../../localStorageService'
import useStaticProps from '../../../hooks/useStaticProps'

export interface UrlFilterParser {
  (rawValue: string[] | Record<string, string[]>):
    | ExtendedFilter['value']
    | null
    | void
}

const stringParser: UrlFilterParser = (value) =>
  Array.isArray(value) ? value[0] : null

function useUrlFilters({
  enabled = true,
  filterConfig,
  filterCategory
}: {
  enabled?: boolean
  filterConfig: { id: string; filterParser: UrlFilterParser }[]
  filterCategory: string
}): [
  ExtendedFilter[],
  (
    filters:
      | ExtendedFilter[]
      | ((prevState: ExtendedFilter[]) => ExtendedFilter[])
  ) => void
] {
  const staticProps = useStaticProps({ filterConfig })

  const getLocalStorageFilters = (): Record<
    ExtendedFilter['id'],
    ExtendedFilter['value']
  > => {
    const LSFilters = localStorageService.getItem(SAVED_FILTERS)
    return (LSFilters && JSON.parse(LSFilters)[filterCategory]) || {}
  }

  const navigate = useNavigate()

  const [filters, setFilters] = useState<ExtendedFilter[]>(
    (): ExtendedFilter[] => {
      if (!enabled) {
        return []
      }

      if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search)
        const parsedSearchParams = Utils.parseSearchParamsToObject(searchParams)

        return staticProps.filterConfig.flatMap(
          ({ id, filterParser = stringParser }) => {
            const parsedValue = filterParser(parsedSearchParams[id])
            return parsedValue ? { id: id, value: parsedValue } : []
          }
        )
      }

      const parsedLSFilters = getLocalStorageFilters()

      const filtersArr = staticProps.filterConfig.flatMap(({ id }) => {
        const parsedValue = parsedLSFilters[id]
        return parsedValue ? { id: id, value: parsedValue } : []
      })

      return filtersArr
    }
  )

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)

    const filtersWithoutDefault = filters.filter(
      ({ defaultFilter }) => !defaultFilter
    )

    const filtersObj = filtersWithoutDefault.reduce(
      (acc: { [key: string]: any }, { id, value }) => {
        acc[id] = value
        return acc
      },
      {}
    )
    localStorageService.updateFilters(filterCategory, filtersObj)

    staticProps.filterConfig.forEach(({ id }) => {
      searchParams.delete(id)
      const paramsArr = [...searchParams]

      paramsArr.forEach(([key]) => {
        if (key.match(new RegExp(`${id}\\[.+\\]`))) {
          searchParams.delete(key)
        }
      })
    })

    filtersWithoutDefault.forEach(({ id, value }) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val) {
            searchParams.append(id, val.toString())
          }
        })
      } else if (Utils.isObject(value)) {
        Object.entries(value).forEach(([innerKey, innerVal]) => {
          if (innerVal) {
            searchParams.append(`${id}[${innerKey}]`, innerVal.toString())
          }
        })
      } else if (!Utils.isEmpty(value)) {
        searchParams.append(id, value.toString())
      }
    })

    navigate(
      {
        pathname: window.location.pathname,
        search: `?${searchParams.toString()}`
      },
      {
        replace: true
      }
    )
  }, [filterCategory, filters, navigate, staticProps.filterConfig])

  return [filters, setFilters]
}

export default useUrlFilters

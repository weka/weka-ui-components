import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Utils } from '../../..'
import { SAVED_FILTERS } from '../../../consts'
import localStorageService from '../../../localStorageService'
import useStaticProps from '../../../hooks/useStaticProps'
import { ExtendedColumnFilter, UrlFilterParser } from '../types'
import { urlFilterParsers } from '../tableUtils'

const defaultFilterParser = urlFilterParsers.string

function useUrlFilters(props: {
  enabled?: boolean
  filterConfig: {
    id: string
    /**
     * If not provided stringParser will be used
     */
    filterParser?: UrlFilterParser | keyof typeof urlFilterParsers
  }[]
  filterCategory: string
}): [
  ExtendedColumnFilter[],
  (
    filters:
      | ExtendedColumnFilter[]
      | ((prevState: ExtendedColumnFilter[]) => ExtendedColumnFilter[])
  ) => void
] {
  const { enabled = true, filterConfig, filterCategory } = props
  const staticProps = useStaticProps({ filterConfig })

  const getLocalStorageFilters = (): Record<string, unknown> => {
    const LSFilters = localStorageService.getItem(SAVED_FILTERS)
    return (LSFilters && JSON.parse(LSFilters)[filterCategory]) || {}
  }

  const navigate = useNavigate()

  const [filters, setFilters] = useState<ExtendedColumnFilter[]>(() => {
    if (!enabled) {
      return []
    }

    if (window.location.search) {
      const searchParams = new URLSearchParams(window.location.search)
      const parsedSearchParams = Utils.parseSearchParamsToObject(searchParams)

      return filterConfig.flatMap(
        ({ id, filterParser = defaultFilterParser }) => {
          const filterParserFunc =
            typeof filterParser === 'string'
              ? urlFilterParsers[filterParser]
              : filterParser

          const parsedValue = filterParserFunc(parsedSearchParams[id])
          return parsedValue ? { id: id, value: parsedValue } : []
        }
      )
    }

    const parsedLSFilters = getLocalStorageFilters()

    const filtersArr = filterConfig.flatMap(({ id }) => {
      const parsedValue = parsedLSFilters[id]
      return parsedValue ? { id: id, value: parsedValue } : []
    })

    return filtersArr
  })

  const handleFiltersChange = useCallback(() => {
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
          if (!Utils.isEmpty(val)) {
            searchParams.append(id, val.toString())
          }
        })
      } else if (Utils.isObject(value)) {
        Object.entries(value).forEach(([innerKey, innerVal]) => {
          if (
            typeof innerVal !== 'string' &&
            typeof innerVal !== 'number' &&
            typeof innerVal !== 'boolean' &&
            typeof innerVal !== 'undefined'
          ) {
            throw new Error('Invalid filter value. Expected string or number.')
          }

          if (!Utils.isEmpty(innerVal)) {
            searchParams.append(`${id}[${innerKey}]`, innerVal.toString())
          }
        })
      } else if (!Utils.isEmpty(value)) {
        if (
          typeof value !== 'string' &&
          typeof value !== 'number' &&
          typeof value !== 'boolean'
        ) {
          throw new Error('Invalid filter value. Expected string or number.')
        }

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

  useEffect(handleFiltersChange, [handleFiltersChange])

  const [searchParams] = useSearchParams()
  const lastSavedSearchRef = useRef<string>()

  useEffect(() => {
    if (lastSavedSearchRef.current !== window.location.search) {
      handleFiltersChange()
    }
    lastSavedSearchRef.current = window.location.search
  }, [handleFiltersChange, searchParams])

  return [filters, setFilters]
}

export default useUrlFilters

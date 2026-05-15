import type { SetStateAction } from 'react'

import { useEffect, useRef, useState } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

const INITIAL_SEARCH_DELAY_MS = 100
const DEBOUNCE_SEARCH_DELAY_MS = 300

interface UseRemoteSearchOptions {
  onSearch?: (query: string) => Promise<string[]>
  inputValue: string
  minSearchLength: number
  defaultOptions: string[]
  showDropdown: boolean
  hasOpenedDropdown: boolean
  selectedValues: string[]
}

interface UseRemoteSearchResult {
  filteredOptions: string[]
  setFilteredOptions: (value: SetStateAction<string[]>) => void
}

function filterOutSelected(options: string[], selected: string[]): string[] {
  return options.filter((opt) => !selected.includes(opt))
}

interface FetchContext {
  searchFn: (query: string) => Promise<string[]>
  getSelectedValues: () => string[]
  defaultOptions: string[]
  isMounted: boolean
}

async function fetchAndSetResults(
  ctx: FetchContext,
  query: string,
  onSuccess: (results: string[]) => void
): Promise<void> {
  try {
    const results = await ctx.searchFn(query)
    if (ctx.isMounted) {
      onSuccess(filterOutSelected(results, ctx.getSelectedValues()))
    }
  } catch {
    if (ctx.isMounted) {
      const fallback = query
        ? []
        : filterOutSelected(ctx.defaultOptions, ctx.getSelectedValues())
      onSuccess(fallback)
    }
  }
}

export function useRemoteSearch({
  onSearch,
  inputValue,
  minSearchLength,
  defaultOptions,
  showDropdown,
  hasOpenedDropdown,
  selectedValues
}: UseRemoteSearchOptions): UseRemoteSearchResult {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])

  const selectedValuesRef = useRef<string[]>(selectedValues)
  const onSearchRef = useRef(onSearch)

  useEffect(() => {
    selectedValuesRef.current = selectedValues
  }, [selectedValues])

  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  const defaultOptionsKey = defaultOptions.join('|')

  useEffect(() => {
    const currentOnSearch = onSearchRef.current
    if (!currentOnSearch || !showDropdown) {
      return
    }

    let isMounted = true
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const ctx: FetchContext = {
      searchFn: currentOnSearch,
      getSelectedValues: () => selectedValuesRef.current,
      isMounted: true,
      defaultOptions
    }

    const handleEmptyInput = () => {
      const filteredDefaults = filterOutSelected(
        defaultOptions,
        selectedValuesRef.current
      )
      setFilteredOptions(filteredDefaults)

      if (hasOpenedDropdown) {
        timeoutId = setTimeout(() => {
          ctx.isMounted = isMounted
          void fetchAndSetResults(ctx, EMPTY_STRING, setFilteredOptions)
        }, INITIAL_SEARCH_DELAY_MS)
      }
    }

    const handleSearchInput = () => {
      setFilteredOptions([])

      timeoutId = setTimeout(() => {
        ctx.isMounted = isMounted
        void fetchAndSetResults(ctx, inputValue, setFilteredOptions)
      }, DEBOUNCE_SEARCH_DELAY_MS)
    }

    if (!inputValue.trim()) {
      handleEmptyInput()
    } else if (inputValue.length >= minSearchLength) {
      handleSearchInput()
    } else {
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setFilteredOptions([])
        }
      }, 0)
    }

    return () => {
      isMounted = false
      ctx.isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [
    inputValue,
    minSearchLength,
    defaultOptionsKey,
    hasOpenedDropdown,
    showDropdown,
    defaultOptions
  ])

  return { filteredOptions, setFilteredOptions }
}

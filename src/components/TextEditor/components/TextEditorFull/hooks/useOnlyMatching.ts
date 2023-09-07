import { useCallback, useEffect, useState } from 'react'

export interface ParsedData {
  [key: string]: any
}

function useOnlyMatching({
  allowSearch,
  onlyMatching,
  searchValue,
  value,
  valueForMatched
}: {
  allowSearch: boolean
  onlyMatching: boolean
  searchValue: string
  value: string
  valueForMatched?: ParsedData
}) {
  const [jsonValue, setJsonValue] = useState(value)

  const getFilteredValue = useCallback(() => {
    const searchTerm = searchValue.toLowerCase()
    const filtered = Object.entries(valueForMatched).reduce<
      Record<string, string | number | boolean>
    >((acc, [key, value]) => {
      if (
        key.toLowerCase().includes(searchTerm) ||
        `${value}`.toLowerCase().includes(searchTerm)
      ) {
        acc[key] = value
      }

      return acc
    }, {})
    return JSON.stringify(filtered, null, 2)
  }, [valueForMatched, searchValue])

  useEffect(() => {
    if (allowSearch) {
      if (onlyMatching && valueForMatched) {
        setJsonValue(getFilteredValue())
      } else {
        setJsonValue(value)
      }
    }
  }, [
    onlyMatching,
    searchValue,
    allowSearch,
    getFilteredValue,
    value,
    valueForMatched
  ])

  return jsonValue
}

export default useOnlyMatching

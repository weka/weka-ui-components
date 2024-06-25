import { useEffect, useState } from 'react'

export type ParsedData = [string, unknown][]

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

  useEffect(() => {
    const getFilteredValue = () => {
      if (!valueForMatched) {
        return value
      }

      const searchTerm = searchValue.toLowerCase()
      const filtered = valueForMatched.reduce<Record<string, unknown>>(
        (acc, [key, value]) => {
          if (
            key.toLowerCase().includes(searchTerm) ||
            `${value}`.toLowerCase().includes(searchTerm)
          ) {
            acc[key] = value
          }

          return acc
        },
        {}
      )
      return JSON.stringify(filtered, null, 2)
    }

    if (allowSearch) {
      if (onlyMatching && valueForMatched) {
        setJsonValue(getFilteredValue())
      } else {
        setJsonValue(value)
      }
    }
  }, [onlyMatching, searchValue, allowSearch, value, valueForMatched])

  return jsonValue
}

export default useOnlyMatching

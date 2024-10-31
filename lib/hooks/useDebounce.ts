import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number, shouldUpdate = true): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (shouldUpdate) {
        setDebouncedValue(value)
      }
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, shouldUpdate])
  return debouncedValue
}

export default useDebounce

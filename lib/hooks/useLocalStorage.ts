import { useCallback, useState } from 'react'

import localStorageService from '../localStorageService'

function readStoredValue<T>(key: string): T | undefined {
  try {
    const rawValue = localStorageService.getItem(key)

    return rawValue === null ? undefined : (JSON.parse(rawValue) as T)
  } catch {
    return undefined
  }
}

/**
 * Keeps a JSON-serializable value in sync with `localStorage`.
 *
 * Yields `undefined` when the key is absent or holds unparsable JSON, so callers can
 * apply a fallback with a destructuring default. Storage access is guarded: private
 * browsing and quota errors leave the value untouched rather than breaking the render.
 */
function useLocalStorage<T>(
  key: string
): [T | undefined, (newValue: T) => void] {
  const [storedValue, setStoredValue] = useState(() => readStoredValue<T>(key))
  const [readKey, setReadKey] = useState(key)

  if (readKey !== key) {
    setReadKey(key)
    setStoredValue(readStoredValue<T>(key))
  }

  const setValue = useCallback(
    (newValue: T) => {
      try {
        localStorageService.setItem(key, JSON.stringify(newValue))
      } catch {
        return
      }

      setStoredValue(newValue)
    },
    [key]
  )

  return [storedValue, setValue]
}

export default useLocalStorage

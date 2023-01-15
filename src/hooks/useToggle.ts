import { useState, useCallback } from 'react'

function useToggle(initialState: string | boolean, options?: string[] | undefined): [string | boolean, () => void] {
  const [value, setValue] = useState<string| boolean>(initialState)
  const toggle = useCallback(() => {
    setValue((state) => {
      if(options) {
        const foundOption = options.find((option) => option !== state)
        return foundOption || ''
      }
      return !state
    })
  }, [])
  return [value, toggle]
}

export default useToggle

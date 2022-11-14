import { useState, useCallback } from 'react'

function useToggle(initialState, options) {
  const [value, setValue] = useState(initialState)
  const toggle = useCallback(() => {
    setValue((state) => (options ? options.find((option) => option !== state) : !state))
  }, [])
  return [value, toggle]
}

export default useToggle

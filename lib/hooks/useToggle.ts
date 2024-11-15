import { useCallback, useState } from 'react'

import { EMPTY_STRING } from 'consts'

function useToggle(initialState: boolean): [boolean, () => void]

function useToggle<Value1 extends string, Value2 extends string>(
  initialState: Value1 | Value2,
  options: [Value1, Value2]
): [Value1 | Value2, () => void]

function useToggle(
  initialState: string | boolean,
  options?: string[] | undefined
): [string | boolean, () => void] {
  const [value, setValue] = useState<string | boolean>(initialState)
  const toggle = useCallback(() => {
    setValue((state) => {
      if (options) {
        const foundOption = options.find((option) => option !== state)
        return foundOption || EMPTY_STRING
      }
      return !state
    })
  }, [])
  return [value, toggle]
}

export default useToggle

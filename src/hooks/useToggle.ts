import { useCallback, useState } from 'react'

function useToggle(initialState: boolean): [boolean, () => void]

function useToggle<Value extends string>(
  initialState: Value,
  options: Value[]
): [Value, () => void]

function useToggle(
  initialState: string | boolean,
  options?: string[] | undefined
): [string | boolean, () => void] {
  const [value, setValue] = useState<string | boolean>(initialState)
  const toggle = useCallback(() => {
    setValue((state) => {
      if (options) {
        const currentOptionIndex = options.findIndex(
          (option) => option === state
        )

        return options[currentOptionIndex + 1] ?? options[0] ?? ""
      }
      return !state
    })
  }, [])
  return [value, toggle]
}

export default useToggle

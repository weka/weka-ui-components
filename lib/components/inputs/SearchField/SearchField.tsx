import React, { useEffect, useState } from 'react'

import { DEFAULT_DEBOUNCE_DELAY, EMPTY_STRING } from 'consts'
import { useDebounce } from 'hooks'

import TextBox from '../TextBox'

export interface SearchFieldProps {
  onValueUpdate: (value: string) => void
  label?: string
  debounceDelay?: number
  shouldUpdateTerm?: boolean
}

function SearchField({
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  shouldUpdateTerm = true,
  label,
  onValueUpdate,
  ...rest
}: SearchFieldProps) {
  const [term, setTerm] = useState<string>(EMPTY_STRING)
  const debouncedTerm = useDebounce(term, debounceDelay, shouldUpdateTerm)

  useEffect(() => {
    onValueUpdate(debouncedTerm)
  }, [debouncedTerm])

  return (
    <TextBox
      label={label}
      onChange={setTerm}
      value={term}
      {...rest}
    />
  )
}

export default SearchField

import React, { useEffect, useState } from 'react'
import TextBox from '../TextBox'
import { DEFAULT_DEBOUNCE_DELAY, EMPTY_STRING } from 'consts'
import { useDebounce } from 'hooks'

export interface SearchFieldProps {
  label: string
  onValueUpdate: (value: string) => void
  debounceDelay?: number
  shouldUpdateTerm?: boolean
}

function SearchField(props: SearchFieldProps) {
  const {
    debounceDelay = DEFAULT_DEBOUNCE_DELAY,
    shouldUpdateTerm = true,
    label,
    onValueUpdate,
    ...rest
  } = props
  const [term, setTerm] = useState<string>(EMPTY_STRING)
  const debouncedTerm = useDebounce(term, debounceDelay, shouldUpdateTerm)

  useEffect(() => {
    onValueUpdate(debouncedTerm)
  }, [debouncedTerm])

  return <TextBox label={label} onChange={setTerm} value={term} {...rest} />
}

export default SearchField

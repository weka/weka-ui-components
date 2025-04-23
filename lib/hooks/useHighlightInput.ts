import { useEffect, RefObject, useState } from 'react'

type UseHighlightInputProps = {
  inputRef: RefObject<HTMLInputElement | HTMLDivElement>
  isScrolledInto?: boolean
  isHighlighted?: boolean
  delay?: number
}

function useHighlightInput({
  inputRef,
  isScrolledInto,
  isHighlighted,
  delay = 2000
}: UseHighlightInputProps) {
  const [highlighted, setHighlighted] = useState(isHighlighted)
  useEffect(() => {
    if (isScrolledInto) {
      inputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [inputRef, isScrolledInto])

  useEffect(() => {
    if (isHighlighted) {
      setHighlighted(isHighlighted)
      const timeoutId = setTimeout(() => {
        setHighlighted(false)
      }, delay)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [delay, isHighlighted, setHighlighted])
  return highlighted
}

export default useHighlightInput

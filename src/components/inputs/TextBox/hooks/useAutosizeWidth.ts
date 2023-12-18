import { useLayoutEffect, useRef, useState } from 'react'

const SIZE_WITHOUT_VALUE = 14

function useAutosizeWidth({
  value,
  autosize = false,
  inputRef
}: {
  value: string | number
  autosize?: boolean
  inputRef: React.RefObject<HTMLInputElement>
}) {
  const [inputWidth, setInputWidth] = useState(SIZE_WITHOUT_VALUE)
  const calculationBoxRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const input = inputRef.current
    const calculationBox = calculationBoxRef.current

    if (!autosize || !input || !calculationBox) {
      return
    }

    calculationBox.style.font = window.getComputedStyle(input).font
  }, [autosize, inputRef])

  useLayoutEffect(() => {
    const input = inputRef.current
    const calculationBox = calculationBoxRef.current

    if (!autosize || !input || !calculationBox) {
      return
    }

    calculationBox.innerText = value.toString()

    const width = calculationBox.getBoundingClientRect().width

    setInputWidth(width + SIZE_WITHOUT_VALUE)
  }, [autosize, inputRef, value])

  return {
    inputWidth,
    calculationBoxRef
  }
}

export default useAutosizeWidth

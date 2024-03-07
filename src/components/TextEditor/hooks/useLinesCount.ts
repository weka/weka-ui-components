import { useEffect } from 'react'
import { useTextEditorContext } from '../context'

function useLinesCount({
  value,
  lines,
  filteredValue
}: {
  value?: string
  lines?: {
    number: string
    text: string
  }[]
  filteredValue?: string
}) {
  const context = useTextEditorContext(true)
  const setTextEditorContext = context?.setTextEditorContext

  useEffect(() => {
    if (!setTextEditorContext) {
      return
    }

    setTextEditorContext((prev) => ({
      ...prev,
      totalLinesCount: value?.split('\n').length,
      ...((lines || filteredValue) && {
        visibleLinesCount: lines
          ? lines.length
          : filteredValue?.split('\n').length
      })
    }))

    return () => {
      setTextEditorContext((prev) => ({
        ...prev,
        totalLinesCount: undefined,
        visibleLinesCount: undefined
      }))
    }
  }, [setTextEditorContext, value, lines, filteredValue])
}

export default useLinesCount

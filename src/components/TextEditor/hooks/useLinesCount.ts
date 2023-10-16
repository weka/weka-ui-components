import { useEffect } from 'react'
import { useTextEditorContext } from '../context'

function useLinesCount({
  value,
  lines
}: {
  value?: string
  lines?: {
    number: string
    text: string
  }[]
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
      ...(lines && {
        visibleLinesCount: lines.length
      })
    }))

    return () => {
      setTextEditorContext((prev) => ({
        ...prev,
        totalLinesCount: undefined,
        visibleLinesCount: undefined
      }))
    }
  }, [setTextEditorContext, value, lines])
}

export default useLinesCount

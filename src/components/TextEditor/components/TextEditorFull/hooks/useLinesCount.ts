import { useEffect } from 'react'
import { useTextEditorContext } from '../../../context'

function useLinesCount({
  value,
  forcedValue
}: {
  value: string
  forcedValue?: string
}) {
  const context = useTextEditorContext(true)
  const setTextEditorContext = context?.setTextEditorContext

  useEffect(() => {
    if (!setTextEditorContext) {
      return
    }

    setTextEditorContext((prev) => ({
      ...prev,
      totalLinesCount: value.split('\n').length,
      ...(typeof forcedValue === 'string' && {
        visibleLinesCount: forcedValue.split('\n').length
      })
    }))

    return () => {
      setTextEditorContext((prev) => ({
        ...prev,
        totalLinesCount: undefined,
        visibleLinesCount: undefined
      }))
    }
  }, [setTextEditorContext, value, forcedValue])
}

export default useLinesCount

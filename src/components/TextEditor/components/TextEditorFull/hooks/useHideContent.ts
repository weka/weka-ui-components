import { useMemo } from 'react'
import { useTextEditorContext } from '../../../context'

function useHideContent({ value }: { value?: string }) {
  const editorContext = useTextEditorContext(true)
  const hideContent = editorContext?.value?.hideContent

  return useMemo(() => {
    if (!value) {
      return value
    }

    if (hideContent) {
      return hideContent.reduce((acc, hideContent) => {
        return acc.replaceAll(new RegExp(hideContent, 'g'), '')
      }, value)
    }

    return value
  }, [hideContent, value])
}

export default useHideContent

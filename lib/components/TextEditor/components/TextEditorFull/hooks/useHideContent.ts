import { useMemo } from 'react'
import { EMPTY_STRING } from 'consts'
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
        return acc.replaceAll(new RegExp(hideContent, 'g'), EMPTY_STRING)
      }, value)
    }

    return value
  }, [hideContent, value])
}

export default useHideContent

import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'
import { useTextEditorContext } from '../context'

function useFontSize({ editor }: { editor?: IAceEditor }) {
  const textEditorContext = useTextEditorContext(true)
  const editorContextValue = textEditorContext?.value

  useEffect(() => {
    if (!editorContextValue?.fontSize) {
      return
    }

    editor?.setOptions({
      fontSize: `${editorContextValue.fontSize}px`
    })
  }, [editor, editorContextValue?.fontSize])
}

export default useFontSize

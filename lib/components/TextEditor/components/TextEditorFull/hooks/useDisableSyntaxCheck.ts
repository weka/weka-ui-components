import { useEffect } from 'react'
import { useTextEditorContext } from '../../../context'
import { IAceEditor } from 'react-ace/lib/types'

function useDisableSyntaxCheck({ editor }: { editor?: IAceEditor }) {
  const editorContext = useTextEditorContext(true)
  const shouldDisableSyntaxCheck =
    editorContext?.value?.shouldDisableSyntaxCheck

  useEffect(() => {
    if (
      !editor ||
      !shouldDisableSyntaxCheck ||
      !shouldDisableSyntaxCheck.size
    ) {
      return
    }

    editor.session.setUseWorker(false)

    return () => {
      editor.session.setUseWorker(true)
    }
  }, [editor, shouldDisableSyntaxCheck])
}

export default useDisableSyntaxCheck

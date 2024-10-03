import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'

function useFoldAll({
  editor,
  foldAll,
  value
}: {
  editor?: IAceEditor
  foldAll: boolean | number
  value: string
}) {
  useEffect(() => {
    if (!editor || !value) {
      return
    }

    if (foldAll) {
      editor
        .getSession()
        .foldAll(
          1,
          editor.getSession().getLength(),
          typeof foldAll === 'number' ? foldAll : Infinity
        )
    } else {
      editor.execCommand('unfoldall')
      editor.scrollToLine(0)
    }
  }, [editor, foldAll, value])
}

export default useFoldAll

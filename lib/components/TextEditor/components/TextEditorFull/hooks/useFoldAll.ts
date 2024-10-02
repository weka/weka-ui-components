import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'

function useFoldAll({
  editor,
  shouldFoldAll,
  value
}: {
  editor?: IAceEditor
  shouldFoldAll: boolean | number
  value: string
}) {
  useEffect(() => {
    if (!editor || !value) {
      return
    }

    if (shouldFoldAll) {
      editor
        .getSession()
        .foldAll(
          1,
          editor.getSession().getLength(),
          typeof shouldFoldAll === 'number' ? shouldFoldAll : Infinity
        )
    } else {
      editor.execCommand('unfoldall')
      editor.scrollToLine(0)
    }
  }, [editor, shouldFoldAll, value])
}

export default useFoldAll

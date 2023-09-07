import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'

function useFoldAll({
  editor,
  shouldFoldAll
}: {
  editor?: IAceEditor
  shouldFoldAll: boolean
}) {
  useEffect(() => {
    if (!editor) {
      return
    }

    if (shouldFoldAll) {
      editor.getSession().foldAll(1, editor.getSession().getLength())
    } else {
      editor.execCommand('unfoldall')
      editor.scrollToLine(0)
    }
  }, [editor, shouldFoldAll])
}

export default useFoldAll

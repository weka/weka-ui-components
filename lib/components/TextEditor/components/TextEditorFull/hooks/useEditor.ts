import type { IAceEditor } from 'react-ace/lib/types'

import { useEffect } from 'react'

function useEditor({
  editor,
  onlyMatching,
  value
}: {
  editor?: IAceEditor
  onlyMatching: boolean
  value: string
}) {
  useEffect(() => {
    if (!value || !editor) {
      return
    }

    editor.scrollToLine(0)
    editor.selection.clearSelection()
  }, [editor, onlyMatching, value])
}

export default useEditor

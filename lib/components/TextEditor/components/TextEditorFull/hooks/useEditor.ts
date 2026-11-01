import type { IAceEditor } from '../../../types'

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

    editor.scrollToLine(0, false, false)
    editor.selection.clearSelection()
  }, [editor, onlyMatching, value])
}

export default useEditor

import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'

function useEditor({
  editor,
  maxLines,
  minLines,
  onlyMatching,
  value
}: {
  editor?: IAceEditor
  maxLines?: number
  minLines?: number
  onlyMatching: boolean
  value: string
}) {
  useEffect(() => {
    editor?.setOptions({
      minLines,
      maxLines
    })
  }, [editor, maxLines, minLines])

  useEffect(() => {
    if (!value || !editor) {
      return
    }

    editor.scrollToLine(0)
    editor.selection.clearSelection()
  }, [editor, onlyMatching, value])
}

export default useEditor

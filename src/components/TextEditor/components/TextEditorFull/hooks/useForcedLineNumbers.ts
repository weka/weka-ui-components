import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'

function useForcedLineNumbers({
  editor,
  value,
  lines
}: {
  editor?: IAceEditor
  value: string
  lines?: {
    number: string
    text: string
  }[]
}) {
  useEffect(() => {
    if (!editor || !lines) {
      return
    }

    editor.clearSelection()
    editor.session.unfold()

    const originalGutterRenderer = editor.session.gutterRenderer

    editor.session.gutterRenderer = {
      getText: function (_session: unknown, row: number) {
        return lines[row]?.number || ''
      },
      getWidth: function (
        _session: unknown,
        lastLineNumber: number,
        config: { characterWidth: number }
      ) {
        return lastLineNumber.toString().length * config.characterWidth
      }
    }

    return () => {
      editor.session.gutterRenderer = originalGutterRenderer
    }
  }, [editor, lines, value])
}

export default useForcedLineNumbers

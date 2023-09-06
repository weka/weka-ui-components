import { useEffect } from 'react'
import { IAceEditor } from 'react-ace/lib/types'
import { useTextEditorContext } from '../context'

function useTags({
  editor,
  value,
  setForcedOptions
}: {
  editor?: IAceEditor
  value: string
  setForcedOptions: (
    newState: (prev: Record<string, unknown>) => {
      value?: string
      disableFolding?: boolean
    }
  ) => void
}) {
  const context = useTextEditorContext(true)
  const tags = context?.value.tags

  useEffect(() => {
    if (!tags || !editor) {
      return
    }

    editor.clearSelection()
    editor.session.unfold()

    let matchedLineIndex = 0
    const matchedLinesNumbersMap: Record<number, number> = {}

    setForcedOptions((prev) => ({
      ...prev,
      disableFolding: true,
      value: value
        .split('\n')
        .filter((line, index) => {
          const matchesAllTags = tags.every((tag) => {
            const tagType = tag[0]
            const tagValue = tag.slice(1)

            return tagType === '+'
              ? line.includes(tagValue)
              : !line.includes(tagValue)
          })

          if (matchesAllTags) {
            matchedLinesNumbersMap[matchedLineIndex] = index + 1
            matchedLineIndex += 1
          }

          return matchesAllTags
        }, [])
        .join('\n')
    }))

    const originalGutterRenderer = editor.session.gutterRenderer

    editor.session.gutterRenderer = {
      getText: function (_session: unknown, row: number) {
        return matchedLinesNumbersMap[row]?.toString() || ''
      },
      getWidth: function (
        _session: unknown,
        lastLineNumber: number,
        config: { characterWidth: number }
      ) {
        return lastLineNumber.toString().length * config.characterWidth
      }
    }

    editor.session.setUseWorker(false)

    return () => {
      editor.session.gutterRenderer = originalGutterRenderer
      editor.session.setUseWorker(true)

      setForcedOptions((prev) => ({
        ...prev,
        disableFolding: undefined,
        value: undefined
      }))
    }
  }, [editor, setForcedOptions, tags, value])
}

export default useTags

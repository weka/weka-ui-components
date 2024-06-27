import { useMemo } from 'react'
import { useTextEditorContext } from '../context'

function useTags({ value }: { value?: string }) {
  const context = useTextEditorContext(true)
  const tags = context?.value.tags

  const lines = useMemo(() => {
    if (!tags?.length || !value) {
      return
    }

    return value.split('\n').flatMap((lineText, index) => {
      const matchesAllTags = tags.every((tag) => {
        const tagType = tag[0]
        const tagValue = tag.slice(1)

        return tagType === '+'
          ? lineText.includes(tagValue)
          : !lineText.includes(tagValue)
      })

      return matchesAllTags
        ? {
            number: (index + 1).toString(),
            text: lineText
          }
        : []
    }, [])
  }, [tags, value])

  return lines
}

export default useTags

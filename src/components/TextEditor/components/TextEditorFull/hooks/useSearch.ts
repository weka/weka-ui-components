import { useEffect, useRef, useState } from 'react'
import { EMPTY_STRING } from '../../../../../consts'
import { IAceEditor } from 'react-ace/lib/types'

function useSearch({
  allowSearch,
  editorReady,
  editor,
  value
}: {
  allowSearch: boolean
  editorReady: boolean
  editor?: IAceEditor
  value: string
}) {
  const [searchValue, setSearchValueState] = useState(EMPTY_STRING)

  const searchValueRef = useRef(searchValue)
  searchValueRef.current = searchValue

  useEffect(() => {
    if (!editor) {
      return
    }

    if (allowSearch) {
      editor.execCommand('find')
      const searchInput = editor.searchBox.searchInput

      if (editor.searchBox.searchInput) {
        searchInput.value = searchValueRef.current
      }

      editor.execCommand('find')
    }
  }, [allowSearch, editor, value])

  useEffect(() => {
    if (allowSearch && editorReady && editor) {
      const onSearchChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        setSearchValueState(target.value)
      }

      const searchInput = editor.searchBox.searchInput
      searchInput?.addEventListener('input', onSearchChange)

      return () => {
        searchInput?.removeEventListener('input', onSearchChange)
      }
    }
  }, [allowSearch, editor, editorReady])

  return searchValue
}

export default useSearch

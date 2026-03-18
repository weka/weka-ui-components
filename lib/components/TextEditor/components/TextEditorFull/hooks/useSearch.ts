import { useEffect, useRef, useState } from 'react'
import type { IAceEditor } from 'react-ace/lib/types'

import { EMPTY_STRING } from 'consts'

export interface ExternalSearchNavigation {
  row: number
  columnStart: number
  columnEnd: number
  key: number
}

function useSearch({
  allowSearch,
  editorReady,
  editor,
  value,
  externalSearchTerm,
  externalSearchIsRegex = false,
  externalSearchNavigation
}: {
  allowSearch: boolean
  editorReady: boolean
  editor?: IAceEditor
  value: string
  externalSearchTerm?: string
  externalSearchIsRegex?: boolean
  externalSearchNavigation?: ExternalSearchNavigation
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

  useEffect(() => {
    if (externalSearchTerm && editor && editorReady) {
      const timeoutId = setTimeout(() => {
        editor.execCommand('find')
        const searchBox = editor.searchBox
        if (searchBox) {
          searchBox.searchInput.value = externalSearchTerm
          searchBox.regExpOption.checked = externalSearchIsRegex
          searchBox.$syncOptions()
        }
      }, 50)
      return () => clearTimeout(timeoutId)
    } else if (!externalSearchTerm && editor) {
      const searchBox = editor.searchBox
      if (searchBox) {
        searchBox.searchInput.value = EMPTY_STRING
        searchBox.$syncOptions()
      }
    }
  }, [externalSearchTerm, externalSearchIsRegex, editor, editorReady, value])

  const lastNavigationKeyRef = useRef(-1)

  useEffect(() => {
    if (
      !externalSearchNavigation ||
      !editor ||
      !editorReady ||
      lastNavigationKeyRef.current === externalSearchNavigation.key
    ) {
      return
    }

    const timeoutId = setTimeout(() => {
      lastNavigationKeyRef.current = externalSearchNavigation.key

      const Range = (window as any).ace.require('ace/range').Range
      const range = new Range(
        externalSearchNavigation.row,
        externalSearchNavigation.columnStart,
        externalSearchNavigation.row,
        externalSearchNavigation.columnEnd
      )
      editor.selection.setRange(range)
      editor.scrollToLine(externalSearchNavigation.row, true, true, () => {})
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [externalSearchNavigation, editor, editorReady, value])

  return searchValue
}

export default useSearch

import { useEffect, useRef, useState } from 'react'
import type { IAceEditor } from 'react-ace/lib/types'

import { EMPTY_STRING } from 'consts'

export interface ExternalSearchAction {
  type: 'next' | 'prev' | 'first' | 'last'
  key: number
}

function useSearch({
  allowSearch,
  editorReady,
  editor,
  value,
  externalSearchTerm,
  externalSearchIsRegex = false,
  externalSearchAction,
  onSearchBoundary
}: {
  allowSearch: boolean
  editorReady: boolean
  editor?: IAceEditor
  value: string
  externalSearchTerm?: string
  externalSearchIsRegex?: boolean
  externalSearchAction?: ExternalSearchAction
  onSearchBoundary?: (direction: 'next' | 'prev') => void
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

  const lastActionKeyRef = useRef(-1)
  const onSearchBoundaryRef = useRef(onSearchBoundary)
  onSearchBoundaryRef.current = onSearchBoundary

  useEffect(() => {
    if (
      !externalSearchAction ||
      !editor ||
      !editorReady ||
      !externalSearchTerm ||
      lastActionKeyRef.current === externalSearchAction.key
    ) {
      return
    }

    const timeoutId = setTimeout(() => {
      lastActionKeyRef.current = externalSearchAction.key

      const findOptions = {
        wrap: false,
        regExp: externalSearchIsRegex,
        caseSensitive: false,
        wholeWord: false
      }

      if (externalSearchAction.type === 'next') {
        const range = editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: true,
          backwards: false
        })
        if (!range) {
          onSearchBoundaryRef.current?.('next')
        }
      } else if (externalSearchAction.type === 'prev') {
        const range = editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: true,
          backwards: true
        })
        if (!range) {
          onSearchBoundaryRef.current?.('prev')
        }
      } else if (externalSearchAction.type === 'first') {
        editor.gotoLine(1, 0, false)
        editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: false,
          backwards: false
        })
      } else if (externalSearchAction.type === 'last') {
        const lastLine = editor.session.getLength()
        editor.gotoLine(lastLine, Infinity, false)
        editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: false,
          backwards: true
        })
      }
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [
    externalSearchAction,
    externalSearchTerm,
    externalSearchIsRegex,
    editor,
    editorReady,
    value
  ])

  return searchValue
}

export default useSearch

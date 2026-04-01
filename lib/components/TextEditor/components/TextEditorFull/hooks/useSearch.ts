import { useEffect, useRef, useState } from 'react'
import type { IAceEditor } from 'react-ace/lib/types'

import { EMPTY_STRING } from 'consts'

export const SEARCH_DIRECTIONS = {
  NEXT: 'next',
  PREV: 'prev',
  FIRST: 'first',
  LAST: 'last'
} as const

export type SearchDirection = (typeof SEARCH_DIRECTIONS)[keyof typeof SEARCH_DIRECTIONS]

export interface ExternalSearchAction {
  type: SearchDirection
  key: number
}

interface AceSearchBox {
  searchInput: HTMLInputElement
  searchCounter?: HTMLElement
  regExpOption: HTMLInputElement & { checked: boolean }
  caseSensitiveOption?: HTMLInputElement & { checked: boolean }
  wholeWordOption?: HTMLInputElement & { checked: boolean }
  $syncOptions: (preventScroll?: boolean) => void
}

function getSearchBox(editor: IAceEditor): AceSearchBox | null {
  return (editor as any).searchBox ?? null
}

function readCounter(
  searchBox: AceSearchBox,
  callback: ((current: number, total: number) => void) | undefined
) {
  searchBox.$syncOptions()
  const text = searchBox.searchCounter?.textContent || EMPTY_STRING
  const counterMatch = text.match(/^(\d+)\s+of\s+(\d+)/)
  if (counterMatch) {
    callback?.(parseInt(counterMatch[1], 10), parseInt(counterMatch[2], 10))
  }
}

function useSearch({
  allowSearch,
  editorReady,
  editor,
  value,
  externalSearchTerm,
  externalSearchIsRegex = false,
  externalSearchCaseSensitive = false,
  externalSearchWholeWord = false,
  externalSearchAction,
  onSearchBoundary,
  onSearchCounterUpdate
}: {
  allowSearch: boolean
  editorReady: boolean
  editor?: IAceEditor
  value: string
  externalSearchTerm?: string
  externalSearchIsRegex?: boolean
  externalSearchCaseSensitive?: boolean
  externalSearchWholeWord?: boolean
  externalSearchAction?: ExternalSearchAction
  onSearchBoundary?: (direction: SearchDirection) => void
  onSearchCounterUpdate?: (current: number, chunkTotal: number) => void
}) {
  const [searchValue, setSearchValueState] = useState(EMPTY_STRING)

  const searchValueRef = useRef(searchValue)
  searchValueRef.current = searchValue

  const lastActionKeyRef = useRef(-1)
  const onSearchBoundaryRef = useRef(onSearchBoundary)
  onSearchBoundaryRef.current = onSearchBoundary
  const onSearchCounterUpdateRef = useRef(onSearchCounterUpdate)
  onSearchCounterUpdateRef.current = onSearchCounterUpdate

  useEffect(() => {
    if (!editor) {
      return
    }

    if (allowSearch) {
      editor.execCommand('find')
      const searchBox = getSearchBox(editor)

      if (searchBox?.searchInput) {
        searchBox.searchInput.value = searchValueRef.current
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

      const searchBox = getSearchBox(editor)
      searchBox?.searchInput?.addEventListener('input', onSearchChange)

      return () => {
        searchBox?.searchInput?.removeEventListener('input', onSearchChange)
      }
    }
  }, [allowSearch, editor, editorReady])

  useEffect(() => {
    if (externalSearchTerm && editor && editorReady) {
      // Ace needs time to process the search and update its counter after $syncOptions
      const timerId = setTimeout(() => {
        if (!getSearchBox(editor)) {
          editor.execCommand('find')
          getSearchBox(editor)?.searchInput?.blur()
        }
        const searchBox = getSearchBox(editor)
        if (searchBox) {
          searchBox.searchInput.value = externalSearchTerm
          searchBox.regExpOption.checked = externalSearchIsRegex
          if (searchBox.caseSensitiveOption && externalSearchCaseSensitive !== undefined) {
            searchBox.caseSensitiveOption.checked = externalSearchCaseSensitive
          }
          if (searchBox.wholeWordOption && externalSearchWholeWord !== undefined) {
            searchBox.wholeWordOption.checked = externalSearchWholeWord
          }
          readCounter(searchBox, onSearchCounterUpdateRef.current)
        }
      }, 50)
      return () => clearTimeout(timerId)
    } else if (!externalSearchTerm && editor) {
      const searchBox = getSearchBox(editor)
      if (searchBox) {
        searchBox.searchInput.value = EMPTY_STRING
        searchBox.$syncOptions()
      }
      onSearchCounterUpdateRef.current?.(0, 0)
    }
  }, [externalSearchTerm, externalSearchIsRegex, externalSearchCaseSensitive, externalSearchWholeWord, editor, editorReady, value])

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

    // Ace needs a frame to finish rendering highlights before counter text is accurate
    const timeoutId = setTimeout(() => {
      lastActionKeyRef.current = externalSearchAction.key

      const findOptions = {
        wrap: false,
        regExp: externalSearchIsRegex,
        caseSensitive: externalSearchCaseSensitive,
        wholeWord: externalSearchWholeWord
      }

      const reportCounter = () => {
        const searchBox = getSearchBox(editor)
        if (searchBox) {
          readCounter(searchBox, onSearchCounterUpdateRef.current)
        }
      }

      if (externalSearchAction.type === SEARCH_DIRECTIONS.NEXT) {
        const range = editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: true,
          backwards: false
        })
        if (!range) {
          onSearchBoundaryRef.current?.(SEARCH_DIRECTIONS.NEXT)
        } else {
          reportCounter()
        }
      } else if (externalSearchAction.type === SEARCH_DIRECTIONS.PREV) {
        const range = editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: true,
          backwards: true
        })
        if (!range) {
          onSearchBoundaryRef.current?.(SEARCH_DIRECTIONS.PREV)
        } else {
          reportCounter()
        }
      } else if (externalSearchAction.type === SEARCH_DIRECTIONS.FIRST) {
        editor.gotoLine(1, 0, false)
        editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: false,
          backwards: false
        })
        reportCounter()
      } else if (externalSearchAction.type === SEARCH_DIRECTIONS.LAST) {
        const lastLine = editor.session.getLength()
        editor.gotoLine(lastLine, Infinity, false)
        editor.find(externalSearchTerm, {
          ...findOptions,
          skipCurrent: false,
          backwards: true
        })
        reportCounter()
      }
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [
    externalSearchAction,
    externalSearchTerm,
    externalSearchIsRegex,
    externalSearchCaseSensitive,
    externalSearchWholeWord,
    editor,
    editorReady,
    value
  ])

  return searchValue
}

export default useSearch

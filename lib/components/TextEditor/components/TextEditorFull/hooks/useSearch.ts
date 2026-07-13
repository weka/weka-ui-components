import type { CountMatchesOptions } from '../workers/countMatches'
import type { IAceEditor } from 'react-ace/lib/types'

import { useCallback, useEffect, useRef } from 'react'

import { EMPTY_STRING } from '#consts'

import useSearchWorker from './useSearchWorker'

export const SEARCH_DIRECTIONS = {
  NEXT: 'next',
  PREV: 'prev',
  FIRST: 'first',
  LAST: 'last'
} as const

export type SearchDirection =
  (typeof SEARCH_DIRECTIONS)[keyof typeof SEARCH_DIRECTIONS]

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

function clearHiddenSearchBox(editor: IAceEditor) {
  const searchBox = getSearchBox(editor)
  if (searchBox) {
    searchBox.searchInput.value = EMPTY_STRING
    searchBox.$syncOptions()
  }
}

/**
 * Used when there are too many matches for Ace's highlight-all rendering:
 * clears the engine searchbox and only selects the nearest match
 */
function selectSingleMatch(
  editor: IAceEditor,
  term: string,
  options: CountMatchesOptions
) {
  clearHiddenSearchBox(editor)
  editor.find(term, {
    regExp: options.isRegex,
    caseSensitive: options.caseSensitive,
    wholeWord: options.wholeWord,
    skipCurrent: false,
    backwards: false,
    wrap: true
  })
}

function syncHiddenSearchBox(
  editor: IAceEditor,
  term: string,
  options: CountMatchesOptions,
  onCounter: ((current: number, total: number) => void) | undefined
) {
  if (!getSearchBox(editor)) {
    editor.execCommand('find')
    getSearchBox(editor)?.searchInput?.blur()
  }
  const searchBox = getSearchBox(editor)
  if (searchBox) {
    searchBox.searchInput.value = term
    searchBox.regExpOption.checked = options.isRegex
    if (searchBox.caseSensitiveOption) {
      searchBox.caseSensitiveOption.checked = options.caseSensitive
    }
    if (searchBox.wholeWordOption) {
      searchBox.wholeWordOption.checked = options.wholeWord
    }
    readCounter(searchBox, onCounter)
  }
}

function useSearch({
  editorReady,
  editor,
  value,
  externalSearchTerm,
  externalSearchIsRegex = false,
  externalSearchCaseSensitive = false,
  externalSearchWholeWord = false,
  externalSearchExceeded = false,
  externalSearchAction,
  onSearchBoundary,
  onSearchCounterUpdate
}: {
  editorReady: boolean
  editor?: IAceEditor
  value: string
  externalSearchTerm?: string
  externalSearchIsRegex?: boolean
  externalSearchCaseSensitive?: boolean
  externalSearchWholeWord?: boolean
  externalSearchExceeded?: boolean
  externalSearchAction?: ExternalSearchAction
  onSearchBoundary?: (direction: SearchDirection) => void
  onSearchCounterUpdate?: (
    current: number,
    chunkTotal: number,
    exceeded?: boolean
  ) => void
}) {
  const lastActionKeyRef = useRef(-1)
  const onSearchBoundaryRef = useRef(onSearchBoundary)
  onSearchBoundaryRef.current = onSearchBoundary
  const onSearchCounterUpdateRef = useRef(onSearchCounterUpdate)
  onSearchCounterUpdateRef.current = onSearchCounterUpdate

  const { setContent, countMatchesAsync } = useSearchWorker()

  const singleMatchModeRef = useRef(false)
  const localCountCappedRef = useRef(false)
  const localTotalRef = useRef(0)

  useEffect(() => {
    setContent(value)
  }, [setContent, value])

  const reportExceededPosition = useCallback(
    async (
      activeEditor: IAceEditor,
      term: string,
      options: CountMatchesOptions
    ) => {
      const index = activeEditor.session
        .getDocument()
        .positionToIndex(activeEditor.getSelectionRange().start, 0)
      const { count } = await countMatchesAsync(term, options, index)
      const total = localTotalRef.current
      onSearchCounterUpdateRef.current?.(
        Math.min(count + 1, total),
        total,
        localCountCappedRef.current
      )
    },
    [countMatchesAsync]
  )

  useEffect(() => {
    if (externalSearchTerm && editor && editorReady) {
      let cancelled = false

      const applyTerm = async () => {
        const options = {
          isRegex: externalSearchIsRegex,
          caseSensitive: externalSearchCaseSensitive,
          wholeWord: externalSearchWholeWord
        }
        const { count, exceeded } = await countMatchesAsync(
          externalSearchTerm,
          options
        )
        if (cancelled) {
          return
        }
        const tooManyMatches = exceeded || externalSearchExceeded
        singleMatchModeRef.current = tooManyMatches
        localCountCappedRef.current = exceeded
        localTotalRef.current = count

        if (tooManyMatches) {
          selectSingleMatch(editor, externalSearchTerm, options)
          await reportExceededPosition(editor, externalSearchTerm, options)
          return
        }

        syncHiddenSearchBox(
          editor,
          externalSearchTerm,
          options,
          onSearchCounterUpdateRef.current
        )
      }

      // Ace needs time to process the search and update its counter after $syncOptions
      const timerId = setTimeout(() => {
        void applyTerm()
      }, 50)
      return () => {
        cancelled = true
        clearTimeout(timerId)
      }
    } else if (!externalSearchTerm && editor) {
      singleMatchModeRef.current = false
      localCountCappedRef.current = false
      localTotalRef.current = 0
      clearHiddenSearchBox(editor)
      onSearchCounterUpdateRef.current?.(0, 0)
    } else {
      // waiting for the editor to mount
    }
  }, [
    externalSearchTerm,
    externalSearchIsRegex,
    externalSearchCaseSensitive,
    externalSearchWholeWord,
    externalSearchExceeded,
    editor,
    editorReady,
    value,
    countMatchesAsync,
    reportExceededPosition
  ])

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
        if (singleMatchModeRef.current) {
          void reportExceededPosition(editor, externalSearchTerm, {
            isRegex: externalSearchIsRegex,
            caseSensitive: externalSearchCaseSensitive,
            wholeWord: externalSearchWholeWord
          })
          return
        }
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
    value,
    reportExceededPosition
  ])
}

export default useSearch

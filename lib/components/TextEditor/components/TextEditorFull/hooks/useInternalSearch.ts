import type { ExternalSearchAction, SearchDirection } from './useSearch'

import { useCallback, useRef, useState } from 'react'

import { EMPTY_STRING } from '#consts'

import { SEARCH_DIRECTIONS } from './useSearch'

/**
 * State and handlers for TextEditor's own search box (ChunkSearchBox rendered
 * by TextEditorFull). It drives the same search engine as the externalSearch*
 * props; consumers that pass externalSearch* props take over instead.
 */
function useInternalSearch() {
  const [searchTerm, setSearchTerm] = useState(EMPTY_STRING)
  const [isRegex, setIsRegex] = useState(false)
  const [isCaseSensitive, setIsCaseSensitive] = useState(false)
  const [isWholeWord, setIsWholeWord] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [action, setAction] = useState<ExternalSearchAction | undefined>(
    undefined
  )
  const [counter, setCounter] = useState({
    current: 0,
    total: 0,
    exceeded: false
  })
  const actionKeyRef = useRef(0)

  const triggerAction = useCallback((type: SearchDirection) => {
    actionKeyRef.current += 1
    setAction({ type, key: actionKeyRef.current })
  }, [])

  const handleNext = useCallback(
    () => triggerAction(SEARCH_DIRECTIONS.NEXT),
    [triggerAction]
  )

  const handlePrev = useCallback(
    () => triggerAction(SEARCH_DIRECTIONS.PREV),
    [triggerAction]
  )

  const wrapSearchAtBoundary = useCallback(
    (direction: SearchDirection) => {
      triggerAction(
        direction === SEARCH_DIRECTIONS.PREV
          ? SEARCH_DIRECTIONS.LAST
          : SEARCH_DIRECTIONS.FIRST
      )
    },
    [triggerAction]
  )

  const handleCounterUpdate = useCallback(
    (current: number, total: number, exceeded = false) => {
      setCounter({ current, total, exceeded })
    },
    []
  )

  return {
    searchTerm,
    setSearchTerm,
    isRegex,
    setIsRegex,
    isCaseSensitive,
    setIsCaseSensitive,
    isWholeWord,
    setIsWholeWord,
    dismissed,
    setDismissed,
    action,
    counter,
    handleNext,
    handlePrev,
    wrapSearchAtBoundary,
    handleCounterUpdate,
    exceeded: counter.exceeded
  }
}

export default useInternalSearch

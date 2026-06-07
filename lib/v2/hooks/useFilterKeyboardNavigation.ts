import type { FilterOption } from '../components/Table/filterUtils'
import type { FilterType } from '#v2/utils/consts'

import { useCallback } from 'react'

import { FILTER_TYPES, KEYBOARD_KEYS } from '#v2/utils/consts'

const NO_SELECTION_INDEX = -1
const SCROLL_DELAY_MS = 0

interface UseFilterKeyboardNavigationProps {
  filteredOptions: FilterOption[]
  selectedOptionIndex: number
  setSelectedOptionIndex: (index: number | ((prev: number) => number)) => void
  setShowOptionsList: (show: boolean) => void
  filterType: FilterType
  onClose: () => void
  onApply: () => void
  onToggleOption: (value: string) => void
}

export function useFilterKeyboardNavigation({
  filteredOptions,
  selectedOptionIndex,
  setSelectedOptionIndex,
  setShowOptionsList,
  filterType,
  onClose,
  onApply,
  onToggleOption
}: UseFilterKeyboardNavigationProps) {
  const scrollToOption = useCallback((index: number) => {
    setTimeout(() => {
      const selectedElement = document.querySelector(
        `[data-option-index="${index}"]`
      )
      selectedElement?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }, SCROLL_DELAY_MS)
  }, [])

  const handleEnter = useCallback(() => {
    const isValidIndex =
      selectedOptionIndex >= 0 && selectedOptionIndex < filteredOptions.length

    if (isValidIndex && filterType === FILTER_TYPES.MULTISELECT) {
      onToggleOption(filteredOptions[selectedOptionIndex].value)
    }

    if (filterType === FILTER_TYPES.DROPDOWN) {
      onApply()
    }
  }, [
    selectedOptionIndex,
    filteredOptions,
    filterType,
    onToggleOption,
    onApply
  ])

  const handleEscape = useCallback(() => {
    if (filterType === FILTER_TYPES.MULTISELECT) {
      setShowOptionsList(false)
      setSelectedOptionIndex(NO_SELECTION_INDEX)
    }
    onClose()
  }, [filterType, setShowOptionsList, setSelectedOptionIndex, onClose])

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (filteredOptions.length === 0) {
        return
      }

      switch (e.key) {
        case KEYBOARD_KEYS.ARROW_DOWN:
          e.preventDefault()
          setSelectedOptionIndex((prev) => {
            const newIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0
            scrollToOption(newIndex)
            return newIndex
          })
          break
        case KEYBOARD_KEYS.ARROW_UP:
          e.preventDefault()
          setSelectedOptionIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1
            scrollToOption(newIndex)
            return newIndex
          })
          break
        case KEYBOARD_KEYS.ENTER:
          e.preventDefault()
          handleEnter()
          break
        case KEYBOARD_KEYS.ESCAPE:
          e.preventDefault()
          handleEscape()
          break
      }
    },
    [
      filteredOptions,
      setSelectedOptionIndex,
      scrollToOption,
      handleEnter,
      handleEscape
    ]
  )

  return { handleGlobalKeyDown }
}

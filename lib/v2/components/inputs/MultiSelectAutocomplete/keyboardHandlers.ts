import type { KeyboardEvent } from 'react'

import { KEYBOARD_KEYS } from '../../../utils/consts'

interface KeyboardState {
  inputValue: string
  value: string[]
  anyValue?: string
  showDropdown: boolean
  filteredOptions: string[]
  selectedIndex: number
}

interface KeyboardActions {
  handleRemoveChip: (value: string) => void
  handleOptionClick: (option: string) => void
  setSelectedIndex: (index: number | ((prev: number) => number)) => void
  setShowDropdown: (show: boolean) => void
}

type KeyboardResult = 'handled' | 'not-handled'

function handleBackspace(
  state: KeyboardState,
  actions: KeyboardActions
): KeyboardResult {
  if (state.inputValue || state.value.length === 0) {
    return 'not-handled'
  }

  const lastValue = state.value[state.value.length - 1]
  if (lastValue === state.anyValue) {
    return 'not-handled'
  }

  actions.handleRemoveChip(lastValue)
  return 'handled'
}

function handleArrowDown(
  state: KeyboardState,
  actions: KeyboardActions
): void {
  actions.setSelectedIndex((prev) =>
    prev < state.filteredOptions.length - 1 ? prev + 1 : 0
  )
}

function handleArrowUp(state: KeyboardState, actions: KeyboardActions): void {
  actions.setSelectedIndex((prev) =>
    prev > 0 ? prev - 1 : state.filteredOptions.length - 1
  )
}

function handleEnter(state: KeyboardState, actions: KeyboardActions): void {
  const { selectedIndex, filteredOptions } = state
  if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
    actions.handleOptionClick(filteredOptions[selectedIndex])
  }
}

function handleEscape(actions: KeyboardActions): void {
  actions.setShowDropdown(false)
  actions.setSelectedIndex(-1)
}

export function createKeyDownHandler(
  state: KeyboardState,
  actions: KeyboardActions
): (e: KeyboardEvent<HTMLInputElement>) => void {
  return (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_KEYS.BACKSPACE) {
      if (handleBackspace(state, actions) === 'handled') {
        return
      }
    }

    if (!state.showDropdown) {
      return
    }

    if (e.key === KEYBOARD_KEYS.ESCAPE) {
      handleEscape(actions)
      return
    }

    if (state.filteredOptions.length === 0) {
      return
    }

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        e.preventDefault()
        handleArrowDown(state, actions)
        break
      case KEYBOARD_KEYS.ARROW_UP:
        e.preventDefault()
        handleArrowUp(state, actions)
        break
      case KEYBOARD_KEYS.ENTER:
        e.preventDefault()
        handleEnter(state, actions)
        break
    }
  }
}

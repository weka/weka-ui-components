import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FILTER_TYPES, KEYBOARD_KEYS } from '#v2/utils/consts'

import { useFilterKeyboardNavigation } from './useFilterKeyboardNavigation'

const OPTIONS = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' }
]

function setup(overrides = {}) {
  const handlers = {
    setSelectedOptionIndex: vi.fn(),
    setShowOptionsList: vi.fn(),
    onClose: vi.fn(),
    onApply: vi.fn(),
    onToggleOption: vi.fn()
  }
  const { result } = renderHook(() =>
    useFilterKeyboardNavigation({
      filteredOptions: OPTIONS,
      selectedOptionIndex: 0,
      filterType: FILTER_TYPES.MULTISELECT,
      ...handlers,
      ...overrides
    })
  )
  return { result, handlers }
}

function keyEvent(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent
}

describe('useFilterKeyboardNavigation', () => {
  it('does nothing when there are no options', () => {
    const { result, handlers } = setup({ filteredOptions: [] })
    result.current.handleGlobalKeyDown(keyEvent(KEYBOARD_KEYS.ARROW_DOWN))
    expect(handlers.setSelectedOptionIndex).not.toHaveBeenCalled()
  })

  it('advances the index on ArrowDown, wrapping at the end', () => {
    const { result, handlers } = setup()
    result.current.handleGlobalKeyDown(keyEvent(KEYBOARD_KEYS.ARROW_DOWN))
    const updater = handlers.setSelectedOptionIndex.mock.calls[0][0]
    expect(updater(0)).toBe(1)
    expect(updater(OPTIONS.length - 1)).toBe(0)
  })

  it('toggles the highlighted option on Enter for multiselect', () => {
    const { result, handlers } = setup({ selectedOptionIndex: 1 })
    result.current.handleGlobalKeyDown(keyEvent(KEYBOARD_KEYS.ENTER))
    expect(handlers.onToggleOption).toHaveBeenCalledWith('b')
  })

  it('applies on Enter for a dropdown filter', () => {
    const { result, handlers } = setup({ filterType: FILTER_TYPES.DROPDOWN })
    result.current.handleGlobalKeyDown(keyEvent(KEYBOARD_KEYS.ENTER))
    expect(handlers.onApply).toHaveBeenCalled()
  })

  it('closes and resets on Escape for multiselect', () => {
    const { result, handlers } = setup()
    result.current.handleGlobalKeyDown(keyEvent(KEYBOARD_KEYS.ESCAPE))
    expect(handlers.setShowOptionsList).toHaveBeenCalledWith(false)
    expect(handlers.onClose).toHaveBeenCalled()
  })
})

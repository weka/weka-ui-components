import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, KEYBOARD_KEYS } from '../../../utils/consts'

import { MultiSelectAutocomplete } from './MultiSelectAutocomplete'

const OPTION_1 = 'Option 1'
const OPTION_2 = 'Option 2'
const OPTION_3 = 'Option 3'
const OPTION_4 = 'Option 4'
const SINGLE_OPTION = 'Single Option'
const ANY_LABEL = 'Any'
const SEARCH_QUERY = 'Option'
const PARTIAL_QUERY = 'Single'
const SHORT_QUERY = 'Opt'
const OPTION_INDEX_SELECTOR = '[data-option-index]'

const mockOptions = [OPTION_1, OPTION_2, OPTION_3, OPTION_4]

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('MultiSelectAutocomplete - Backspace key handling', () => {
  it('removes last chip when input is empty and backspace is pressed', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[OPTION_1, OPTION_2]}
      />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: KEYBOARD_KEYS.BACKSPACE
    })

    expect(onChange).toHaveBeenCalledWith([OPTION_1])
  })

  it('does not remove chip when input has text', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[OPTION_1, OPTION_2]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.BACKSPACE })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not remove chip when no values exist', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: KEYBOARD_KEYS.BACKSPACE
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not remove "Any" value chip', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        anyValue={ANY_LABEL}
        onChange={onChange}
        options={mockOptions}
        value={[ANY_LABEL]}
      />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: KEYBOARD_KEYS.BACKSPACE
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not remove the last "Any" chip when preceding values are present', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        anyValue={ANY_LABEL}
        onChange={onChange}
        options={mockOptions}
        value={[OPTION_1, ANY_LABEL]}
      />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: KEYBOARD_KEYS.BACKSPACE
    })

    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('MultiSelectAutocomplete - Arrow navigation', () => {
  it('cycles through options with ArrowDown', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    expect(document.querySelector('[data-option-index="0"]')).toBeInTheDocument()

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    expect(document.querySelector('[data-option-index="1"]')).toBeInTheDocument()
  })

  it('wraps to first option when reaching end with ArrowDown', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    for (let i = 0; i < mockOptions.length + 1; i += 1) {
      fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    }

    expect(document.querySelector('[data-option-index="0"]')).toBeInTheDocument()
  })

  it('cycles backward with ArrowUp', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_UP })
    expect(document.querySelector('[data-option-index="3"]')).toBeInTheDocument()

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_UP })
    expect(document.querySelector('[data-option-index="2"]')).toBeInTheDocument()
  })

  it('does not navigate when dropdown is closed', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: KEYBOARD_KEYS.ARROW_DOWN
    })

    expect(document.querySelector(OPTION_INDEX_SELECTOR)).not.toBeInTheDocument()
  })

  it('does not navigate when no options are available', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={[]}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })

    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })
})

describe('MultiSelectAutocomplete - Enter key', () => {
  it('selects currently highlighted option', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith([OPTION_2])
  })

  it('does nothing if no option is highlighted', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does nothing if dropdown is closed', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: KEYBOARD_KEYS.ENTER
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('selects "Any" value when highlighted', () => {
    const onChange = vi.fn()
    const optionsWithAny = [ANY_LABEL, ...mockOptions]
    render(
      <MultiSelectAutocomplete
        anyValue={ANY_LABEL}
        minSearchLength={0}
        onChange={onChange}
        options={optionsWithAny}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith([ANY_LABEL])
  })

  it('clears input value after selection', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole<HTMLInputElement>('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(input.value).toBe(EMPTY_STRING)
  })
})

describe('MultiSelectAutocomplete - Escape key', () => {
  it('closes dropdown when pressed', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    expect(document.querySelector(OPTION_INDEX_SELECTOR)).toBeInTheDocument()

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ESCAPE })

    expect(document.querySelector(OPTION_INDEX_SELECTOR)).not.toBeInTheDocument()
  })

  it('closes dropdown when pressed even with no matching options', () => {
    const NO_MATCH_QUERY = 'NotAnOption'
    const NO_MATCHES_MESSAGE = 'No matches found'
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: NO_MATCH_QUERY } })

    expect(screen.getByText(NO_MATCHES_MESSAGE)).toBeInTheDocument()

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ESCAPE })

    expect(screen.queryByText(NO_MATCHES_MESSAGE)).not.toBeInTheDocument()
  })

  it('resets selected index to -1 (Enter after Escape does nothing)', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ESCAPE })

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SHORT_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('MultiSelectAutocomplete - Combined keyboard interactions', () => {
  it('handles complex navigation and selection flow', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_UP })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith([OPTION_1])
  })

  it('handles multiple selections', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    rerender(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={mockOptions}
        value={[OPTION_1]}
      />
    )

    fireEvent.change(input, { target: { value: SEARCH_QUERY } })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenLastCalledWith([OPTION_1, OPTION_2])
  })

  it('prevents default behavior for navigation keys', () => {
    render(
      <MultiSelectAutocomplete
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    const arrowDownEvent = new KeyboardEvent('keydown', {
      key: KEYBOARD_KEYS.ARROW_DOWN,
      bubbles: true,
      cancelable: true
    })
    const preventDefaultSpy = vi.spyOn(arrowDownEvent, 'preventDefault')
    input.dispatchEvent(arrowDownEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})

describe('MultiSelectAutocomplete - Edge cases', () => {
  it('handles empty options array gracefully', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={[]}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('handles single option correctly', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectAutocomplete
        onChange={onChange}
        options={[SINGLE_OPTION]}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: PARTIAL_QUERY } })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith([SINGLE_OPTION])
  })

  it('closes dropdown after maxVisibleChips is 1 and option is selected', () => {
    render(
      <MultiSelectAutocomplete
        maxVisibleChips={1}
        onChange={vi.fn()}
        options={mockOptions}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SEARCH_QUERY } })

    expect(document.querySelector(OPTION_INDEX_SELECTOR)).toBeInTheDocument()

    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })

    expect(document.querySelector(OPTION_INDEX_SELECTOR)).not.toBeInTheDocument()
  })
})

describe('MultiSelectAutocomplete - Remote search prompt', () => {
  const MIN_SEARCH_LENGTH = 2
  const SHORT_REMOTE_QUERY = 'a'
  const PROMPT_BELOW_MIN = `Type at least ${MIN_SEARCH_LENGTH} characters to search...`
  const NO_MATCHES_MESSAGE = 'No matches found'

  it('keeps dropdown open with "type at least N" prompt while typing below minSearchLength', () => {
    render(
      <MultiSelectAutocomplete
        minSearchLength={MIN_SEARCH_LENGTH}
        onChange={vi.fn()}
        onSearch={vi.fn()}
        options={[]}
        value={[]}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: SHORT_REMOTE_QUERY } })

    expect(screen.getByText(PROMPT_BELOW_MIN)).toBeInTheDocument()
    expect(screen.queryByText(NO_MATCHES_MESSAGE)).not.toBeInTheDocument()
  })
})

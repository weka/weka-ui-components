import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, SEARCH_PLACEHOLDER } from '#v2/utils/consts'

import { FilterSearch } from './FilterSearch'

const INPUT_TEST_ID = 'filter-search-input'
const DEBOUNCE_MS = 300
const NO_SELECTION_INDEX = -1
const LONG_QUERY = 'abcd'
const CLEAR_BUTTON_NAME = 'Clear search'

function renderFilterSearch(overrides: Record<string, unknown> = {}) {
  const props = {
    setShowOptionsList: vi.fn(),
    setSelectedOptionIndex: vi.fn(),
    onSearch: vi.fn(),
    onClear: vi.fn(),
    ...overrides
  }
  render(<FilterSearch {...props} />)
  return props
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('FilterSearch - rendering', () => {
  it('renders with the default placeholder', () => {
    renderFilterSearch()
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
  })

  it('renders a custom placeholder', () => {
    renderFilterSearch({ placeholder: 'Find buckets…' })
    expect(screen.getByPlaceholderText('Find buckets…')).toBeInTheDocument()
  })

  it('reflects the controlled value', () => {
    renderFilterSearch({ value: 'preset' })
    expect(screen.getByTestId(INPUT_TEST_ID)).toHaveValue('preset')
  })
})

describe('FilterSearch - searching', () => {
  it('debounces onSearch and opens the options list for queries longer than one char', () => {
    vi.useFakeTimers()
    const { onSearch, setShowOptionsList } = renderFilterSearch()
    fireEvent.change(screen.getByTestId(INPUT_TEST_ID), {
      target: { value: 'ab' }
    })

    expect(onSearch).not.toHaveBeenCalledWith('ab')
    vi.advanceTimersByTime(DEBOUNCE_MS)
    expect(onSearch).toHaveBeenCalledWith('ab')
    expect(setShowOptionsList).toHaveBeenLastCalledWith(true)
  })

  it('clears results immediately for queries of one char or fewer', () => {
    const { onSearch, setShowOptionsList } = renderFilterSearch()
    fireEvent.change(screen.getByTestId(INPUT_TEST_ID), {
      target: { value: 'a' }
    })

    expect(setShowOptionsList).toHaveBeenCalledWith(false)
    expect(onSearch).toHaveBeenCalledWith(EMPTY_STRING)
  })

  it('cancels a pending debounced search when the query shrinks to one char or fewer', () => {
    vi.useFakeTimers()
    const { onSearch, setShowOptionsList } = renderFilterSearch()
    const input = screen.getByTestId(INPUT_TEST_ID)

    fireEvent.change(input, { target: { value: LONG_QUERY } })
    fireEvent.change(input, { target: { value: 'a' } })

    vi.advanceTimersByTime(DEBOUNCE_MS)

    expect(onSearch).not.toHaveBeenCalledWith(LONG_QUERY)
    expect(setShowOptionsList).toHaveBeenLastCalledWith(false)
  })

  it('cancels a pending debounced search when the field is cleared', () => {
    vi.useFakeTimers()
    const { onSearch, setShowOptionsList } = renderFilterSearch()
    const input = screen.getByTestId(INPUT_TEST_ID)

    fireEvent.change(input, { target: { value: LONG_QUERY } })
    fireEvent.click(screen.getByRole('button', { name: CLEAR_BUTTON_NAME }))

    vi.advanceTimersByTime(DEBOUNCE_MS)

    expect(onSearch).not.toHaveBeenCalledWith(LONG_QUERY)
    expect(setShowOptionsList).toHaveBeenLastCalledWith(false)
  })

  it('resets the selected option index on every change', () => {
    const { setSelectedOptionIndex } = renderFilterSearch()
    fireEvent.change(screen.getByTestId(INPUT_TEST_ID), {
      target: { value: 'abc' }
    })

    expect(setSelectedOptionIndex).toHaveBeenCalledWith(NO_SELECTION_INDEX)
  })
})

describe('FilterSearch - clearing', () => {
  it('shows a clear button once text is present and clears on click', () => {
    const { onClear, onSearch, setShowOptionsList } = renderFilterSearch({
      value: 'region'
    })

    fireEvent.click(screen.getByRole('button', { name: CLEAR_BUTTON_NAME }))

    expect(screen.getByTestId(INPUT_TEST_ID)).toHaveValue(EMPTY_STRING)
    expect(onClear).toHaveBeenCalled()
    expect(onSearch).toHaveBeenLastCalledWith(EMPTY_STRING)
    expect(setShowOptionsList).toHaveBeenCalledWith(false)
  })

  it('hides the clear button while loading', () => {
    renderFilterSearch({ value: 'region', isLoading: true })
    expect(
      screen.queryByRole('button', { name: CLEAR_BUTTON_NAME })
    ).not.toBeInTheDocument()
  })
})

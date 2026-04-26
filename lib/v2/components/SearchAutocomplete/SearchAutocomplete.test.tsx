import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, KEYBOARD_KEYS, SEARCH_PLACEHOLDER } from '../../utils/consts'

import type { SearchOption } from './SearchAutocomplete'
import { SearchAutocomplete } from './SearchAutocomplete'

const SAMPLE_OPTIONS: readonly SearchOption[] = [
  { id: '1', label: 'Apple', sublabel: 'Fruit' },
  { id: '2', label: 'Banana', sublabel: 'Fruit' },
  { id: '3', label: 'Carrot', sublabel: 'Vegetable' }
]

const ROLE_TEXTBOX = 'textbox'
const CLEAR_SEARCH_LABEL = 'Clear search'

describe('SearchAutocomplete - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the input with default placeholder', () => {
    render(<SearchAutocomplete />)
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
  })

  it('renders the input with custom placeholder', () => {
    render(<SearchAutocomplete placeholder='Find items' />)
    expect(screen.getByPlaceholderText('Find items')).toBeInTheDocument()
  })

  it('renders the value when provided', () => {
    render(<SearchAutocomplete value='hello' />)
    expect(screen.getByRole(ROLE_TEXTBOX)).toHaveValue('hello')
  })

  it('does not render dropdown when there is no query', () => {
    render(<SearchAutocomplete options={SAMPLE_OPTIONS} />)
    expect(screen.queryByText(SAMPLE_OPTIONS[0].label)).not.toBeInTheDocument()
  })
})

describe('SearchAutocomplete - Search Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens dropdown when typing', () => {
    render(<SearchAutocomplete options={SAMPLE_OPTIONS} />)
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.getByText(SAMPLE_OPTIONS[0].label)).toBeInTheDocument()
  })

  it('closes dropdown when input is cleared', () => {
    render(<SearchAutocomplete options={SAMPLE_OPTIONS} />)
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.getByText(SAMPLE_OPTIONS[0].label)).toBeInTheDocument()
    fireEvent.change(input, { target: { value: EMPTY_STRING } })
    expect(screen.queryByText(SAMPLE_OPTIONS[0].label)).not.toBeInTheDocument()
  })

  it('debounces onSearch callback', async () => {
    const onSearch = vi.fn()
    render(
      <SearchAutocomplete
        debounceMs={50}
        onSearch={onSearch}
        options={SAMPLE_OPTIONS}
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    expect(onSearch).not.toHaveBeenCalled()
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('a'))
  })

  it('calls onSearch immediately with empty string when cleared', () => {
    const onSearch = vi.fn()
    render(
      <SearchAutocomplete
        onSearch={onSearch}
        options={SAMPLE_OPTIONS}
        value='a'
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: EMPTY_STRING } })
    expect(onSearch).toHaveBeenCalledWith(EMPTY_STRING)
  })
})

describe('SearchAutocomplete - Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onSelect when option is clicked', () => {
    const onSelect = vi.fn()
    render(
      <SearchAutocomplete
        onSelect={onSelect}
        options={SAMPLE_OPTIONS}
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.click(screen.getByText(SAMPLE_OPTIONS[0].label))
    expect(onSelect).toHaveBeenCalledWith(SAMPLE_OPTIONS[0])
  })

  it('selects option on Enter key', () => {
    const onSelect = vi.fn()
    render(
      <SearchAutocomplete
        onSelect={onSelect}
        options={SAMPLE_OPTIONS}
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })
    expect(onSelect).toHaveBeenCalledWith(SAMPLE_OPTIONS[0])
  })

  it('closes dropdown on Enter after selecting', () => {
    render(
      <SearchAutocomplete
        onSelect={vi.fn()}
        options={SAMPLE_OPTIONS}
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.getByText(SAMPLE_OPTIONS[0].label)).toBeInTheDocument()
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })
    expect(screen.queryByText(SAMPLE_OPTIONS[0].label)).not.toBeInTheDocument()
  })
})

describe('SearchAutocomplete - Clear Button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows clear button when there is a value', () => {
    render(<SearchAutocomplete value='a' />)
    expect(
      screen.getByRole('button', { name: CLEAR_SEARCH_LABEL })
    ).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchAutocomplete />)
    expect(
      screen.queryByRole('button', { name: CLEAR_SEARCH_LABEL })
    ).not.toBeInTheDocument()
  })

  it('does not show clear button when loading', () => {
    render(
      <SearchAutocomplete
        isLoading
        value='a'
      />
    )
    expect(
      screen.queryByRole('button', { name: CLEAR_SEARCH_LABEL })
    ).not.toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn()
    render(
      <SearchAutocomplete
        onClear={onClear}
        value='a'
      />
    )
    fireEvent.click(screen.getByRole('button', { name: CLEAR_SEARCH_LABEL }))
    expect(onClear).toHaveBeenCalled()
  })
})

describe('SearchAutocomplete - Error and Empty States', () => {
  it('shows error message when error prop is set', () => {
    render(
      <SearchAutocomplete
        error='Something went wrong'
        options={SAMPLE_OPTIONS}
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows no results message when options are empty', () => {
    render(<SearchAutocomplete options={[]} />)
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'xyz' } })
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('shows custom no results message', () => {
    render(
      <SearchAutocomplete
        noResultsMessage='Nothing here'
        options={[]}
      />
    )
    const input = screen.getByRole(ROLE_TEXTBOX)
    fireEvent.change(input, { target: { value: 'xyz' } })
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })
})

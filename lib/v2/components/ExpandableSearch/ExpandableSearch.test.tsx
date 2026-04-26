import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KEYBOARD_KEYS, SEARCH_PLACEHOLDER } from '../../utils'

import { ExpandableSearch } from './ExpandableSearch'

const createProps = (overrides = {}) => ({
  onSearch: vi.fn(),
  onClear: vi.fn(),
  ...overrides
})

const openSearch = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Search' }))
}

describe('ExpandableSearch - Collapsed State', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search icon button when collapsed', () => {
    render(<ExpandableSearch {...createProps()} />)
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('does not show input field when collapsed', () => {
    render(<ExpandableSearch {...createProps()} />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})

describe('ExpandableSearch - Expanded State', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('expands when search icon is clicked', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows input with default placeholder', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
  })

  it('shows input with custom placeholder', () => {
    render(
      <ExpandableSearch {...createProps({ placeholder: 'Find items...' })} />
    )
    openSearch()
    expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument()
  })

  it('auto-focuses input when expanded', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    expect(screen.getByRole('textbox')).toHaveFocus()
  })
})

describe('ExpandableSearch - Search Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<ExpandableSearch {...createProps({ onSearch })} />)
    openSearch()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('shows clear button when input has value', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(screen.getByTitle('Clear search')).toBeInTheDocument()
  })

  it('clears input and collapses when clear button is clicked', () => {
    const onClear = vi.fn()
    render(<ExpandableSearch {...createProps({ onClear })} />)
    openSearch()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })

    fireEvent.mouseDown(screen.getByTitle('Clear search'))

    expect(onClear).toHaveBeenCalled()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('collapses on blur when input is empty', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    fireEvent.blur(screen.getByRole('textbox'))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('does not collapse on blur when input has value', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.blur(input)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})

describe('ExpandableSearch - Keyboard Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears and collapses on Escape key', () => {
    const onClear = vi.fn()
    render(<ExpandableSearch {...createProps({ onClear })} />)
    openSearch()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ESCAPE })
    expect(onClear).toHaveBeenCalled()
  })

  it('calls onSubmit on Enter key when showSubmitButton is true', () => {
    const onSubmit = vi.fn()
    render(
      <ExpandableSearch
        {...createProps({ onSubmit, showSubmitButton: true })}
      />
    )
    openSearch()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: KEYBOARD_KEYS.ENTER })
    expect(onSubmit).toHaveBeenCalledWith('test')
  })
})

describe('ExpandableSearch - Submit Button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows submit button when showSubmitButton is true', () => {
    render(<ExpandableSearch {...createProps({ showSubmitButton: true })} />)
    openSearch()
    expect(
      screen.getByRole('button', { name: 'Close search' })
    ).toBeInTheDocument()
  })

  it('changes submit button title when input has value', () => {
    render(<ExpandableSearch {...createProps({ showSubmitButton: true })} />)
    openSearch()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(
      screen.getByRole('button', { name: 'Add to filters' })
    ).toBeInTheDocument()
  })

  it('calls onSubmit when submit button is clicked with value', () => {
    const onSubmit = vi.fn()
    render(
      <ExpandableSearch
        {...createProps({ onSubmit, showSubmitButton: true })}
      />
    )
    openSearch()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Add to filters' }))
    expect(onSubmit).toHaveBeenCalledWith('test')
  })
})

describe('ExpandableSearch - Search Icon in Expanded State', () => {
  it('always shows search icon button when expanded', () => {
    render(<ExpandableSearch {...createProps()} />)
    openSearch()
    expect(
      screen.getByRole('button', { name: 'Close search' })
    ).toBeInTheDocument()
  })
})

describe('ExpandableSearch - DataTestId', () => {
  it('applies dataTestId to container', () => {
    render(<ExpandableSearch {...createProps({ dataTestId: 'my-search' })} />)
    expect(screen.getByTestId('my-search')).toBeInTheDocument()
  })

  it('applies suffixed dataTestId to open button', () => {
    render(<ExpandableSearch {...createProps({ dataTestId: 'my-search' })} />)
    expect(screen.getByTestId('my-search-open')).toBeInTheDocument()
  })
})

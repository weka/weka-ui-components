import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, SEARCH_PLACEHOLDER } from '#v2/utils/consts'

import { CheckboxDropdown, type CheckboxOption } from './CheckboxDropdown'

const createOptions = (count = 3): CheckboxOption[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `option-${index + 1}`,
    label: `Option ${index + 1}`,
    checked: false
  }))

const createProps = (overrides = {}) => ({
  options: createOptions(),
  onApply: vi.fn(),
  onClose: vi.fn(),
  ...overrides
})

const clickApply = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

describe('CheckboxDropdown - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    render(<CheckboxDropdown {...createProps()} />)
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(<CheckboxDropdown {...createProps()} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('renders select all option with default label', () => {
    render(<CheckboxDropdown {...createProps()} />)
    expect(screen.getByText('Select All')).toBeInTheDocument()
  })

  it('renders select all option with custom label', () => {
    render(
      <CheckboxDropdown {...createProps({ selectAllLabel: 'Choose All' })} />
    )
    expect(screen.getByText('Choose All')).toBeInTheDocument()
  })

  it('renders apply button with default label', () => {
    render(<CheckboxDropdown {...createProps()} />)
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
  })

  it('renders apply button with custom label', () => {
    render(<CheckboxDropdown {...createProps({ applyLabel: 'Submit' })} />)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('renders with data-testid when provided', () => {
    render(
      <CheckboxDropdown {...createProps({ dataTestId: 'test-dropdown' })} />
    )
    expect(screen.getByTestId('test-dropdown')).toBeInTheDocument()
  })
})

describe('CheckboxDropdown - Search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('filters options based on search query', () => {
    render(<CheckboxDropdown {...createProps()} />)

    fireEvent.change(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), {
      target: { value: 'Option 1' }
    })

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument()
  })

  it('shows all options when search is cleared', () => {
    render(<CheckboxDropdown {...createProps()} />)

    const searchInput = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
    fireEvent.change(searchInput, { target: { value: 'Option 1' } })
    fireEvent.change(searchInput, { target: { value: EMPTY_STRING } })

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })
})

describe('CheckboxDropdown - Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toggles individual option when clicked', () => {
    const onApply = vi.fn()
    const onClose = vi.fn()
    render(<CheckboxDropdown {...createProps({ onApply, onClose })} />)

    fireEvent.click(screen.getByTestId('chart-option-option-1'))
    clickApply()

    expect(onApply).toHaveBeenCalledWith(['option-1'])
  })

  it('selects all options when select all is clicked', () => {
    const onApply = vi.fn()
    const onClose = vi.fn()
    render(<CheckboxDropdown {...createProps({ onApply, onClose })} />)

    fireEvent.click(screen.getByTestId('select-all-option'))
    clickApply()

    expect(onApply).toHaveBeenCalledWith(
      expect.arrayContaining(['option-1', 'option-2', 'option-3'])
    )
  })

  it('deselects all options when select all is clicked on fully selected dropdown', () => {
    const onApply = vi.fn()
    const onClose = vi.fn()
    const options = createOptions()
    options.forEach((option) => (option.checked = true))
    render(<CheckboxDropdown {...createProps({ options, onApply, onClose })} />)

    fireEvent.click(screen.getByTestId('select-all-option'))
    clickApply()

    expect(onApply).toHaveBeenCalledWith([])
  })
})

describe('CheckboxDropdown - Props sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates selection when options prop changes', () => {
    const onApply = vi.fn()
    const options1 = createOptions()
    const { rerender } = render(
      <CheckboxDropdown {...createProps({ options: options1, onApply })} />
    )

    const options2 = createOptions()
    options2[0].checked = true
    rerender(
      <CheckboxDropdown {...createProps({ options: options2, onApply })} />
    )

    clickApply()

    expect(onApply).toHaveBeenCalledWith(['option-1'])
  })

  it('preserves user selection when options reference changes but values are same', () => {
    const onApply = vi.fn()
    const options1 = createOptions()
    const { rerender } = render(
      <CheckboxDropdown {...createProps({ options: options1, onApply })} />
    )

    fireEvent.click(screen.getByTestId('chart-option-option-2'))

    const options2 = createOptions()
    rerender(
      <CheckboxDropdown {...createProps({ options: options2, onApply })} />
    )

    clickApply()

    expect(onApply).toHaveBeenCalledWith(['option-2'])
  })
})

describe('CheckboxDropdown - Apply', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onApply with selected ids when apply button is clicked', () => {
    const onApply = vi.fn()
    const onClose = vi.fn()
    render(<CheckboxDropdown {...createProps({ onApply, onClose })} />)

    fireEvent.click(screen.getByTestId('chart-option-option-1'))
    fireEvent.click(screen.getByTestId('chart-option-option-3'))
    clickApply()

    expect(onApply).toHaveBeenCalledWith(
      expect.arrayContaining(['option-1', 'option-3'])
    )
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('calls onClose after applying', () => {
    const onClose = vi.fn()
    render(<CheckboxDropdown {...createProps({ onClose })} />)

    clickApply()

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onApply with empty array when no options selected', () => {
    const onApply = vi.fn()
    const onClose = vi.fn()
    render(<CheckboxDropdown {...createProps({ onApply, onClose })} />)

    clickApply()

    expect(onApply).toHaveBeenCalledWith([])
  })
})

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  EMPTY_STRING,
  KEYBOARD_KEYS,
  SEARCH_PLACEHOLDER
} from '../../../utils/consts'

import type { SelectOption } from './Select'
import { Select } from './Select'

const TEST_ID = 'my-select'
const REQUIRED_INDICATOR = '*'
const LABEL_TEXT = 'Country'
const CUSTOM_PLACEHOLDER = 'Choose option'
const OPTION_1 = 'Option 1'
const OPTION_2 = 'Option 2'
const OPTION_3 = 'Option 3'
const SELECT_OPTION_PREFIX = 'select-option-'
const LOADING_TEXT = 'Loading...'
const NO_RESULTS_TEXT = 'No results found'
const NO_OPTIONS_TEXT = 'No options available'
const ANY_VALUE = 'any'
const SEARCH_THRESHOLD_OPTIONS = 15
const MAX_VISIBLE_CHIPS = 2
const REMAINING_INDICATOR = '+1'

const mockOptions: SelectOption[] = [
  { value: 'option1', label: OPTION_1 },
  { value: 'option2', label: OPTION_2 },
  { value: 'option3', label: OPTION_3 }
]

const fruitOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'mango', label: 'Mango' }
]

const createProps = (overrides = {}) => ({
  options: mockOptions,
  value: EMPTY_STRING,
  onChange: vi.fn(),
  ...overrides
})

function openSelect() {
  fireEvent.mouseDown(screen.getByRole('combobox'))
}

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('Select - Rendering', () => {
  it('renders select component', () => {
    render(<Select {...createProps()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Select {...createProps({ label: LABEL_TEXT })} />)
    expect(screen.getByText(LABEL_TEXT)).toBeInTheDocument()
  })

  it('renders required indicator when required is true', () => {
    render(<Select {...createProps({ label: LABEL_TEXT, required: true })} />)
    expect(screen.getByText(REQUIRED_INDICATOR)).toBeInTheDocument()
  })

  it('renders placeholder when no value selected', () => {
    render(<Select {...createProps({ placeholder: CUSTOM_PLACEHOLDER })} />)
    expect(screen.getByText(CUSTOM_PLACEHOLDER)).toBeInTheDocument()
  })

  it('renders selected value', () => {
    render(<Select {...createProps({ value: 'option1' })} />)
    expect(screen.getByText(OPTION_1)).toBeInTheDocument()
  })

  it('renders with data-testid', () => {
    render(<Select {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
  })

  it('renders as disabled when disabled is true', () => {
    render(<Select {...createProps({ disabled: true })} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true')
  })
})

describe('Select - Single Select', () => {
  it('opens dropdown on click', async () => {
    render(<Select {...createProps()} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    expect(screen.getByText(OPTION_1)).toBeInTheDocument()
    expect(screen.getByText(OPTION_2)).toBeInTheDocument()
    expect(screen.getByText(OPTION_3)).toBeInTheDocument()
  })

  it('calls onChange when option is selected', async () => {
    const onChange = vi.fn()
    render(<Select {...createProps({ onChange })} />)

    openSelect()
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId(`${SELECT_OPTION_PREFIX}option1`))

    expect(onChange).toHaveBeenCalledWith('option1')
  })

  it('closes dropdown after selection', async () => {
    render(<Select {...createProps()} />)

    openSelect()
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId(`${SELECT_OPTION_PREFIX}option1`))

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  it('displays selected option label after rerender', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<Select {...createProps({ onChange })} />)

    openSelect()
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId(`${SELECT_OPTION_PREFIX}option2`))

    rerender(<Select {...createProps({ value: 'option2', onChange })} />)

    expect(screen.getByTitle(OPTION_2)).toBeInTheDocument()
  })
})

describe('Select - Multiple Select', () => {
  it('renders as multi-select', async () => {
    render(<Select {...createProps({ multiple: true, value: [] })} />)

    openSelect()

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  it('allows selecting multiple options', async () => {
    const onChange = vi.fn()
    render(
      <Select {...createProps({ multiple: true, value: [], onChange })} />
    )

    openSelect()
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId(`${SELECT_OPTION_PREFIX}option1`))

    expect(onChange).toHaveBeenCalledWith(['option1'])
  })

  it('renders chips for selected values', () => {
    render(
      <Select
        {...createProps({
          multiple: true,
          value: ['option1', 'option2']
        })}
      />
    )

    expect(screen.getByText(OPTION_1)).toBeInTheDocument()
    expect(screen.getByText(OPTION_2)).toBeInTheDocument()
  })

  it('removes chip when close button is clicked', () => {
    const onChange = vi.fn()
    render(
      <Select
        {...createProps({
          multiple: true,
          value: ['option1', 'option2'],
          onChange
        })}
      />
    )

    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[0])

    expect(onChange).toHaveBeenCalledWith(['option2'])
  })

  it('shows remaining count when maxVisibleChips is exceeded', () => {
    render(
      <Select
        {...createProps({
          multiple: true,
          value: ['option1', 'option2', 'option3'],
          maxVisibleChips: MAX_VISIBLE_CHIPS
        })}
      />
    )

    expect(screen.getByText(REMAINING_INDICATOR)).toBeInTheDocument()
  })
})

describe('Select - anyValue behavior', () => {
  it('auto-selects "Any" when the last chip is removed via close button', () => {
    const onChange = vi.fn()
    const optionsWithAny = [
      { value: ANY_VALUE, label: 'Any' },
      ...mockOptions
    ]

    render(
      <Select
        {...createProps({
          options: optionsWithAny,
          multiple: true,
          value: ['option1'],
          anyValue: ANY_VALUE,
          onChange
        })}
      />
    )

    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[0])

    expect(onChange).toHaveBeenCalledWith([ANY_VALUE])
  })

  it('removes chip without anyValue fallback when other chips remain', () => {
    const onChange = vi.fn()
    const optionsWithAny = [
      { value: ANY_VALUE, label: 'Any' },
      ...mockOptions
    ]

    render(
      <Select
        {...createProps({
          options: optionsWithAny,
          multiple: true,
          value: ['option1', 'option2'],
          anyValue: ANY_VALUE,
          onChange
        })}
      />
    )

    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[0])

    expect(onChange).toHaveBeenCalledWith(['option2'])
  })

  it('deselects other options when anyValue is selected from menu', async () => {
    const onChange = vi.fn()
    const optionsWithAny = [
      { value: ANY_VALUE, label: 'Any' },
      ...mockOptions
    ]

    render(
      <Select
        {...createProps({
          options: optionsWithAny,
          multiple: true,
          value: ['option1', 'option2'],
          anyValue: ANY_VALUE,
          onChange
        })}
      />
    )

    openSelect()
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId(`${SELECT_OPTION_PREFIX}${ANY_VALUE}`))

    expect(onChange).toHaveBeenCalledWith([ANY_VALUE])
  })

  it('deselects other options when anyValue is selected via keyboard Enter', async () => {
    const onChange = vi.fn()
    const optionsWithAny = [
      { value: ANY_VALUE, label: 'Any' },
      ...mockOptions
    ]

    render(
      <Select
        {...createProps({
          options: optionsWithAny,
          multiple: true,
          value: ['option1', 'option2'],
          anyValue: ANY_VALUE,
          onChange
        })}
      />
    )

    openSelect()
    const listbox = await screen.findByRole('listbox')

    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith([ANY_VALUE])
  })

  it('removes anyValue when a regular option is selected via keyboard Enter', async () => {
    const onChange = vi.fn()
    const optionsWithAny = [
      { value: ANY_VALUE, label: 'Any' },
      ...mockOptions
    ]

    render(
      <Select
        {...createProps({
          options: optionsWithAny,
          multiple: true,
          value: [ANY_VALUE],
          anyValue: ANY_VALUE,
          onChange
        })}
      />
    )

    openSelect()
    const listbox = await screen.findByRole('listbox')

    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith(['option1'])
  })

  it('falls back to anyValue when the last regular option is deselected via keyboard Enter', async () => {
    const onChange = vi.fn()
    const optionsWithAny = [
      { value: ANY_VALUE, label: 'Any' },
      ...mockOptions
    ]

    render(
      <Select
        {...createProps({
          options: optionsWithAny,
          multiple: true,
          value: ['option1'],
          anyValue: ANY_VALUE,
          onChange
        })}
      />
    )

    openSelect()
    const listbox = await screen.findByRole('listbox')

    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ARROW_DOWN })
    fireEvent.keyDown(listbox, { key: KEYBOARD_KEYS.ENTER })

    expect(onChange).toHaveBeenCalledWith([ANY_VALUE])
  })
})

describe('Select - Search functionality', () => {
  it('shows search input when options exceed threshold', async () => {
    const manyOptions = Array.from({ length: SEARCH_THRESHOLD_OPTIONS }, (_, i) => ({
      value: `option${i}`,
      label: `Option ${i}`
    }))

    render(<Select {...createProps({ options: manyOptions })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
    })
  })

  it('filters options based on search query', async () => {
    render(<Select {...createProps({ options: fruitOptions })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), {
      target: { value: 'app' }
    })

    await waitFor(() => {
      expect(
        screen.getByTestId(`${SELECT_OPTION_PREFIX}apple`)
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`${SELECT_OPTION_PREFIX}banana`)
      ).not.toBeInTheDocument()
    })
  })

  it('shows "No results found" when search has no matches', async () => {
    render(<Select {...createProps({ options: fruitOptions })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), {
      target: { value: 'xyz' }
    })

    await waitFor(() => {
      expect(screen.getByText(NO_RESULTS_TEXT)).toBeInTheDocument()
    })
  })

  it('clears search when clear button is clicked', async () => {
    const manyOptions = Array.from({ length: SEARCH_THRESHOLD_OPTIONS }, (_, i) => ({
      value: `option${i}`,
      label: `Option ${i}`
    }))

    render(<Select {...createProps({ options: manyOptions })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(SEARCH_PLACEHOLDER)
    fireEvent.change(searchInput, { target: { value: 'test' } })

    const clearButton = screen.getByRole('button', { name: EMPTY_STRING })
    fireEvent.click(clearButton)

    expect(searchInput).toHaveValue(EMPTY_STRING)
  })
})

describe('Select - Loading state', () => {
  it('shows loading indicator when isLoading is true', async () => {
    render(<Select {...createProps({ isLoading: true })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument()
    })
  })
})

describe('Select - Options with icons', () => {
  it('renders options with icons', async () => {
    const optionsWithIcons: SelectOption[] = [
      {
        value: 'opt1',
        label: OPTION_1,
        icon: <span data-testid='icon-1'>icon</span>
      }
    ]

    render(<Select {...createProps({ options: optionsWithIcons })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByTestId('icon-1')).toBeInTheDocument()
    })
  })
})

describe('Select - Empty state', () => {
  it('shows "No options available" when options array is empty', async () => {
    render(<Select {...createProps({ options: [] })} />)
    openSelect()

    await waitFor(() => {
      expect(screen.getByText(NO_OPTIONS_TEXT)).toBeInTheDocument()
    })
  })
})

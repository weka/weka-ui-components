import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { TextArea } from './TextArea'

const TEST_VALUE = 'test value'
const PLACEHOLDER_TEXT = 'Enter description...'
const LABEL_TEXT = 'Description'
const NOTES_LABEL = 'Notes'
const DESCRIPTION_ID = 'description'
const NOTES_ID = 'notes-input'
const REQUIRED_INDICATOR = '*'
const CUSTOM_CLASS = 'custom-class'
const TEST_ID = 'my-textarea'
const TYPED_CHAR = 'a'
const NEWLINE = '\n'
const DEFAULT_ROWS_ATTR = '4'
const CUSTOM_ROWS = 10
const CUSTOM_ROWS_ATTR = '10'

const createProps = (overrides = {}) => ({
  value: EMPTY_STRING,
  onChange: vi.fn(),
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('TextArea - Rendering', () => {
  it('renders textarea element', () => {
    render(<TextArea {...createProps()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with provided value', () => {
    render(<TextArea {...createProps({ value: TEST_VALUE })} />)
    expect(screen.getByRole('textbox')).toHaveValue(TEST_VALUE)
  })

  it('renders with placeholder', () => {
    render(<TextArea {...createProps({ placeholder: PLACEHOLDER_TEXT })} />)
    expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <TextArea {...createProps({ label: LABEL_TEXT, id: DESCRIPTION_ID })} />
    )
    expect(screen.getByText(LABEL_TEXT)).toBeInTheDocument()
  })

  it('renders required indicator when required is true', () => {
    render(<TextArea {...createProps({ label: LABEL_TEXT, required: true })} />)
    expect(screen.getByText(REQUIRED_INDICATOR)).toBeInTheDocument()
  })

  it('does not render required indicator when required is false', () => {
    render(
      <TextArea {...createProps({ label: LABEL_TEXT, required: false })} />
    )
    expect(screen.queryByText(REQUIRED_INDICATOR)).not.toBeInTheDocument()
  })

  it('applies extraClass to textarea', () => {
    render(<TextArea {...createProps({ extraClass: CUSTOM_CLASS })} />)
    expect(screen.getByRole('textbox')).toHaveClass(CUSTOM_CLASS)
  })

  it('renders with data-testid', () => {
    render(<TextArea {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
  })

  it('renders with default 4 rows', () => {
    render(<TextArea {...createProps()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'rows',
      DEFAULT_ROWS_ATTR
    )
  })

  it('renders with custom rows', () => {
    render(<TextArea {...createProps({ rows: CUSTOM_ROWS })} />)
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'rows',
      CUSTOM_ROWS_ATTR
    )
  })
})

describe('TextArea - User Interactions', () => {
  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<TextArea {...createProps({ onChange })} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: TYPED_CHAR }
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(TYPED_CHAR)
  })

  it('handles newline input', () => {
    const onChange = vi.fn()
    render(<TextArea {...createProps({ onChange })} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: NEWLINE }
    })

    expect(onChange).toHaveBeenCalledWith(NEWLINE)
  })
})

describe('TextArea - Disabled state', () => {
  it('disables textarea when disabled is true', () => {
    render(<TextArea {...createProps({ disabled: true })} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('enables textarea when disabled is false', () => {
    render(<TextArea {...createProps({ disabled: false })} />)
    expect(screen.getByRole('textbox')).not.toBeDisabled()
  })
})

describe('TextArea - ReadOnly state', () => {
  it('makes textarea readonly when readOnly is true', () => {
    render(<TextArea {...createProps({ readOnly: true })} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('allows editing when readOnly is false', () => {
    render(<TextArea {...createProps({ readOnly: false })} />)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly')
  })
})

describe('TextArea - Accessibility', () => {
  it('associates label with textarea via htmlFor', () => {
    render(<TextArea {...createProps({ label: NOTES_LABEL, id: NOTES_ID })} />)

    expect(screen.getByText(NOTES_LABEL)).toHaveAttribute('for', NOTES_ID)
  })
})

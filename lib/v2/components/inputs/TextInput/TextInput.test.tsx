import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { TEXT_INPUT_TYPES, TextInput } from './TextInput'

const TEST_VALUE = 'test value'
const PLACEHOLDER_TEXT = 'Enter text...'
const LABEL_TEXT = 'Username'
const EMAIL_LABEL = 'Email'
const USERNAME_ID = 'username'
const EMAIL_ID = 'email-input'
const REQUIRED_INDICATOR = '*'
const CUSTOM_CLASS = 'custom-class'
const TEST_ID = 'my-input'
const PASS_TEST_ID = 'pass-input'
const TYPED_CHAR = 'a'
const SELECT_END_POSITION = 4

const createProps = (overrides = {}) => ({
  value: EMPTY_STRING,
  onChange: vi.fn(),
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('TextInput - Rendering', () => {
  it('renders input element', () => {
    render(<TextInput {...createProps()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with provided value', () => {
    render(<TextInput {...createProps({ value: TEST_VALUE })} />)
    expect(screen.getByRole('textbox')).toHaveValue(TEST_VALUE)
  })

  it('renders with placeholder', () => {
    render(<TextInput {...createProps({ placeholder: PLACEHOLDER_TEXT })} />)
    expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <TextInput {...createProps({ label: LABEL_TEXT, id: USERNAME_ID })} />
    )
    expect(screen.getByText(LABEL_TEXT)).toBeInTheDocument()
  })

  it('renders required indicator when required is true', () => {
    render(
      <TextInput {...createProps({ label: LABEL_TEXT, required: true })} />
    )
    expect(screen.getByText(REQUIRED_INDICATOR)).toBeInTheDocument()
  })

  it('does not render required indicator when required is false', () => {
    render(
      <TextInput {...createProps({ label: LABEL_TEXT, required: false })} />
    )
    expect(screen.queryByText(REQUIRED_INDICATOR)).not.toBeInTheDocument()
  })

  it('applies extraClass to input', () => {
    render(<TextInput {...createProps({ extraClass: CUSTOM_CLASS })} />)
    expect(screen.getByRole('textbox')).toHaveClass(CUSTOM_CLASS)
  })

  it('renders with data-testid', () => {
    render(<TextInput {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
  })
})

describe('TextInput - Input types', () => {
  it.each([
    { type: TEXT_INPUT_TYPES.TEXT },
    { type: TEXT_INPUT_TYPES.EMAIL },
    { type: TEXT_INPUT_TYPES.URL }
  ])('renders with type $type', ({ type }) => {
    render(<TextInput {...createProps({ type })} />)
    expect(screen.getByRole('textbox').getAttribute('type')).toBe(type)
  })

  it('renders with type password', () => {
    render(
      <TextInput
        {...createProps({
          type: TEXT_INPUT_TYPES.PASSWORD,
          dataTestId: PASS_TEST_ID
        })}
      />
    )
    expect(screen.getByTestId(PASS_TEST_ID).getAttribute('type')).toBe(
      TEXT_INPUT_TYPES.PASSWORD
    )
  })
})

describe('TextInput - User Interactions', () => {
  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<TextInput {...createProps({ onChange })} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: TYPED_CHAR }
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(TYPED_CHAR)
  })

  it('selects text on focus when selectOnFocus is true', () => {
    render(
      <TextInput {...createProps({ value: 'test', selectOnFocus: true })} />
    )

    const input = screen.getByRole<HTMLInputElement>('textbox')
    input.focus()
    fireEvent.focus(input)

    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(SELECT_END_POSITION)
  })

  it('does not select all on focus when selectOnFocus is false', () => {
    render(
      <TextInput {...createProps({ value: 'test', selectOnFocus: false })} />
    )

    const input = screen.getByRole<HTMLInputElement>('textbox')
    input.focus()
    fireEvent.focus(input)

    expect(input.selectionStart).toBe(input.selectionEnd)
  })
})

describe('TextInput - Disabled state', () => {
  it('disables input when disabled is true', () => {
    render(<TextInput {...createProps({ disabled: true })} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('enables input when disabled is false', () => {
    render(<TextInput {...createProps({ disabled: false })} />)
    expect(screen.getByRole('textbox')).not.toBeDisabled()
  })
})

describe('TextInput - ReadOnly state', () => {
  it('makes input readonly when readOnly is true', () => {
    render(<TextInput {...createProps({ readOnly: true })} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('allows editing when readOnly is false', () => {
    render(<TextInput {...createProps({ readOnly: false })} />)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly')
  })
})

describe('TextInput - Accessibility', () => {
  it('associates label with input via htmlFor', () => {
    render(<TextInput {...createProps({ label: EMAIL_LABEL, id: EMAIL_ID })} />)

    expect(screen.getByText(EMAIL_LABEL)).toHaveAttribute('for', EMAIL_ID)
  })

  it('has autocomplete off by default', () => {
    render(<TextInput {...createProps()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off')
  })
})

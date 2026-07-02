import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { PasswordInput } from './PasswordInput'

const TEST_VALUE = 'test value'
const PLACEHOLDER_TEXT = 'Enter password...'
const LABEL_TEXT = 'Password'
/* eslint-disable-next-line sonarjs/no-hardcoded-passwords -- HTML id attribute value, not a password */
const PASSWORD_ID = 'password'
const REQUIRED_INDICATOR = '*'
const TEST_ID = 'password-input'
const TYPED_CHAR = 'a'
const STRONG_VALUE = 'StrongPass1!'
const SHOW_BTN_LABEL = 'Show password'
const HIDE_BTN_LABEL = 'Hide password'
const RULES_HEADER = 'Password must contain:'
const RULE_LENGTH = 'At least 8 characters'
const RULE_UPPER = 'One uppercase letter'
const RULE_LOWER = 'One lowercase letter'
const RULE_NUMBER = 'One number or special character'

const createProps = (overrides = {}) => ({
  value: EMPTY_STRING,
  onChange: vi.fn(),
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('PasswordInput - Rendering', () => {
  it('renders input element with correct test id', () => {
    render(<PasswordInput {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
  })

  it('renders with provided value', () => {
    render(
      <PasswordInput
        {...createProps({ value: TEST_VALUE, dataTestId: TEST_ID })}
      />
    )
    expect(screen.getByTestId(TEST_ID)).toHaveValue(TEST_VALUE)
  })

  it('renders with placeholder', () => {
    render(
      <PasswordInput {...createProps({ placeholder: PLACEHOLDER_TEXT })} />
    )
    expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <PasswordInput {...createProps({ label: LABEL_TEXT, id: PASSWORD_ID })} />
    )
    expect(screen.getByText(LABEL_TEXT)).toBeInTheDocument()
  })

  it('renders required indicator when required is true', () => {
    render(
      <PasswordInput {...createProps({ label: LABEL_TEXT, required: true })} />
    )
    expect(screen.getByText(REQUIRED_INDICATOR)).toBeInTheDocument()
  })

  it('does not render required indicator when required is false', () => {
    render(
      <PasswordInput {...createProps({ label: LABEL_TEXT, required: false })} />
    )
    expect(screen.queryByText(REQUIRED_INDICATOR)).not.toBeInTheDocument()
  })

  it('renders with type password by default', () => {
    render(<PasswordInput {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toHaveAttribute('type', 'password')
  })

  it('has autocomplete new-password', () => {
    render(<PasswordInput {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toHaveAttribute(
      'autocomplete',
      'new-password'
    )
  })
})

describe('PasswordInput - Eye toggle', () => {
  it('shows eye button to reveal password', () => {
    render(<PasswordInput {...createProps()} />)
    expect(
      screen.getByRole('button', { name: SHOW_BTN_LABEL })
    ).toBeInTheDocument()
  })

  it('toggles input type from password to text when eye button clicked', () => {
    render(<PasswordInput {...createProps({ dataTestId: TEST_ID })} />)
    const input = screen.getByTestId(TEST_ID)
    expect(input).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: SHOW_BTN_LABEL }))
    expect(input).toHaveAttribute('type', 'text')
  })

  it('toggles input type back to password on second click', () => {
    render(<PasswordInput {...createProps({ dataTestId: TEST_ID })} />)
    const input = screen.getByTestId(TEST_ID)

    fireEvent.click(screen.getByRole('button', { name: SHOW_BTN_LABEL }))
    expect(input).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByRole('button', { name: HIDE_BTN_LABEL }))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('updates aria-label on eye button after toggle', () => {
    render(<PasswordInput {...createProps()} />)
    const button = screen.getByRole('button', { name: SHOW_BTN_LABEL })
    fireEvent.click(button)
    expect(
      screen.getByRole('button', { name: HIDE_BTN_LABEL })
    ).toBeInTheDocument()
  })
})

describe('PasswordInput - User Interactions', () => {
  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(
      <PasswordInput {...createProps({ onChange, dataTestId: TEST_ID })} />
    )

    fireEvent.change(screen.getByTestId(TEST_ID), {
      target: { value: TYPED_CHAR }
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(TYPED_CHAR)
  })
})

describe('PasswordInput - Disabled state', () => {
  it('disables input when disabled is true', () => {
    render(
      <PasswordInput
        {...createProps({ disabled: true, dataTestId: TEST_ID })}
      />
    )
    expect(screen.getByTestId(TEST_ID)).toBeDisabled()
  })

  it('enables input when disabled is false', () => {
    render(
      <PasswordInput
        {...createProps({ disabled: false, dataTestId: TEST_ID })}
      />
    )
    expect(screen.getByTestId(TEST_ID)).not.toBeDisabled()
  })
})

describe('PasswordInput - ReadOnly state', () => {
  it('makes input readonly when readOnly is true', () => {
    render(
      <PasswordInput
        {...createProps({ readOnly: true, dataTestId: TEST_ID })}
      />
    )
    expect(screen.getByTestId(TEST_ID)).toHaveAttribute('readonly')
  })

  it('allows editing when readOnly is false', () => {
    render(
      <PasswordInput
        {...createProps({ readOnly: false, dataTestId: TEST_ID })}
      />
    )
    expect(screen.getByTestId(TEST_ID)).not.toHaveAttribute('readonly')
  })
})

describe('PasswordInput - Password rules', () => {
  it('does not render rules section when showRules is false', () => {
    render(<PasswordInput {...createProps({ showRules: false })} />)
    expect(screen.queryByText(RULES_HEADER)).not.toBeInTheDocument()
  })

  it('renders rules header when showRules is true', () => {
    render(<PasswordInput {...createProps({ showRules: true })} />)
    expect(screen.getByText(RULES_HEADER)).toBeInTheDocument()
  })

  it('renders all 4 rule labels when showRules is true', () => {
    render(<PasswordInput {...createProps({ showRules: true })} />)
    expect(screen.getByText(RULE_LENGTH)).toBeInTheDocument()
    expect(screen.getByText(RULE_UPPER)).toBeInTheDocument()
    expect(screen.getByText(RULE_LOWER)).toBeInTheDocument()
    expect(screen.getByText(RULE_NUMBER)).toBeInTheDocument()
  })

  it('marks all rules as met for a strong password', () => {
    render(
      <PasswordInput
        {...createProps({ value: STRONG_VALUE, showRules: true })}
      />
    )
    expect(screen.getByText(RULE_LENGTH).className).toMatch(/met/)
    expect(screen.getByText(RULE_UPPER).className).toMatch(/met/)
    expect(screen.getByText(RULE_LOWER).className).toMatch(/met/)
    expect(screen.getByText(RULE_NUMBER).className).toMatch(/met/)
  })

  it('marks no rules as met for an empty password', () => {
    render(
      <PasswordInput
        {...createProps({ value: EMPTY_STRING, showRules: true })}
      />
    )
    expect(screen.getByText(RULE_LENGTH).className).not.toMatch(/met/)
  })
})

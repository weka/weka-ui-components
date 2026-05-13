import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '../../../utils/consts'

import { NumberInput } from './NumberInput'

const STRING_VALUE = '42'
const NUMERIC_VALUE = 42
const PLACEHOLDER_TEXT = 'Enter number...'
const QUANTITY_LABEL = 'Quantity'
const COUNT_LABEL = 'Count'
const QUANTITY_ID = 'quantity'
const COUNT_ID = 'count-input'
const REQUIRED_INDICATOR = '*'
const CUSTOM_CLASS = 'custom-class'
const TEST_ID = 'my-input'
const TYPED_DIGIT = '5'

const MIN_ZERO = 0
const MAX_HUNDRED = 100
const STEP_FIVE = 5
const STEP_ONE = 1
const VALUE_FIVE = 5
const VALUE_TEN = 10
const VALUE_NINETY_NINE = 99
const VALUE_ONE = 1
const RESULT_SIX = '6'
const RESULT_FOUR = '4'
const RESULT_TEN_STR = '10'
const RESULT_FIVE_STR = '5'
const RESULT_HUNDRED = '100'
const RESULT_ZERO = '0'
const RESULT_ONE = '1'
const SPIN_BUTTON_COUNT = 2

const createProps = (overrides = {}) => ({
  value: EMPTY_STRING,
  onChange: vi.fn(),
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('NumberInput - Rendering', () => {
  it('renders input element with type number', () => {
    render(<NumberInput {...createProps()} />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('renders with string value', () => {
    render(<NumberInput {...createProps({ value: STRING_VALUE })} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(NUMERIC_VALUE)
  })

  it('renders with numeric value', () => {
    render(<NumberInput {...createProps({ value: NUMERIC_VALUE })} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(NUMERIC_VALUE)
  })

  it('renders with placeholder', () => {
    render(<NumberInput {...createProps({ placeholder: PLACEHOLDER_TEXT })} />)
    expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <NumberInput {...createProps({ label: QUANTITY_LABEL, id: QUANTITY_ID })} />
    )
    expect(screen.getByText(QUANTITY_LABEL)).toBeInTheDocument()
  })

  it('renders required indicator when required is true', () => {
    render(
      <NumberInput {...createProps({ label: QUANTITY_LABEL, required: true })} />
    )
    expect(screen.getByText(REQUIRED_INDICATOR)).toBeInTheDocument()
  })

  it('does not render required indicator when required is false', () => {
    render(
      <NumberInput {...createProps({ label: QUANTITY_LABEL, required: false })} />
    )
    expect(screen.queryByText(REQUIRED_INDICATOR)).not.toBeInTheDocument()
  })

  it('applies extraClass to input', () => {
    render(<NumberInput {...createProps({ extraClass: CUSTOM_CLASS })} />)
    expect(screen.getByRole('spinbutton')).toHaveClass(CUSTOM_CLASS)
  })

  it('renders with data-testid', () => {
    render(<NumberInput {...createProps({ dataTestId: TEST_ID })} />)
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
  })

  it('does not render spin buttons by default', () => {
    render(<NumberInput {...createProps()} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('renders spin buttons when showArrows is true', () => {
    render(<NumberInput {...createProps({ showArrows: true })} />)
    expect(screen.getAllByRole('button')).toHaveLength(SPIN_BUTTON_COUNT)
  })
})

describe('NumberInput - Min/Max/Step attributes', () => {
  it('sets min attribute', () => {
    render(<NumberInput {...createProps({ min: MIN_ZERO })} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'min',
      String(MIN_ZERO)
    )
  })

  it('sets max attribute', () => {
    render(<NumberInput {...createProps({ max: MAX_HUNDRED })} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'max',
      String(MAX_HUNDRED)
    )
  })

  it('sets step attribute', () => {
    render(<NumberInput {...createProps({ step: STEP_FIVE })} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute(
      'step',
      String(STEP_FIVE)
    )
  })
})

describe('NumberInput - User Interactions', () => {
  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<NumberInput {...createProps({ onChange })} />)

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: TYPED_DIGIT }
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(TYPED_DIGIT)
  })
})

describe('NumberInput - Spin Button Interactions', () => {
  it('increments value when up button is clicked', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_FIVE,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledWith(RESULT_SIX)
  })

  it('decrements value when down button is clicked', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_FIVE,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[1])
    expect(onChange).toHaveBeenCalledWith(RESULT_FOUR)
  })

  it('uses step value for increment', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_FIVE,
          step: STEP_FIVE,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledWith(RESULT_TEN_STR)
  })

  it('uses step value for decrement', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_TEN,
          step: STEP_FIVE,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[1])
    expect(onChange).toHaveBeenCalledWith(RESULT_FIVE_STR)
  })

  it('increments up to max value', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_NINETY_NINE,
          max: MAX_HUNDRED,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledWith(RESULT_HUNDRED)
  })

  it('does not exceed max value', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: MAX_HUNDRED,
          max: MAX_HUNDRED,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('decrements down to min value', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_ONE,
          min: MIN_ZERO,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[1])
    expect(onChange).toHaveBeenCalledWith(RESULT_ZERO)
  })

  it('does not go below min value', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: MIN_ZERO,
          min: MIN_ZERO,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[1])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not change value when disabled', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_FIVE,
          disabled: true,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getAllByRole('button')[1])

    expect(onChange).not.toHaveBeenCalled()
  })

  it('handles empty value as 0', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: EMPTY_STRING,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledWith(RESULT_ONE)
  })

  it('respects default step of 1 when step is not provided', () => {
    const onChange = vi.fn()
    render(
      <NumberInput
        {...createProps({
          onChange,
          value: VALUE_FIVE,
          showArrows: true
        })}
      />
    )

    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledWith(String(VALUE_FIVE + STEP_ONE))
  })
})

describe('NumberInput - Disabled state', () => {
  it('disables input when disabled is true', () => {
    render(<NumberInput {...createProps({ disabled: true })} />)
    expect(screen.getByRole('spinbutton')).toBeDisabled()
  })

  it('enables input when disabled is false', () => {
    render(<NumberInput {...createProps({ disabled: false })} />)
    expect(screen.getByRole('spinbutton')).not.toBeDisabled()
  })
})

describe('NumberInput - Accessibility', () => {
  it('associates label with input via htmlFor', () => {
    render(
      <NumberInput {...createProps({ label: COUNT_LABEL, id: COUNT_ID })} />
    )

    expect(screen.getByText(COUNT_LABEL)).toHaveAttribute('for', COUNT_ID)
  })

  it('has autocomplete off by default', () => {
    render(<NumberInput {...createProps()} />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('autocomplete', 'off')
  })
})

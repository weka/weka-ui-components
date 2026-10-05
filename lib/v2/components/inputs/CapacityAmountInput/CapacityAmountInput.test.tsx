import type { CapacityAmountValue } from './CapacityAmountInput'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { CapacityAmountInput } from './CapacityAmountInput'

const BINARY_STEP = 1024
const MIB = BINARY_STEP * BINARY_STEP
const GIB = MIB * BINARY_STEP

const UNIT_OPTIONS = [
  { label: 'MiB', value: MIB },
  { label: 'GiB', value: GIB }
]

const TEN_MIB_VALUE: CapacityAmountValue = {
  number: 10,
  unit: { label: 'MiB', value: UNIT_OPTIONS[0].value }
}

describe('CapacityAmountInput', () => {
  it('renders the current number and unit', () => {
    render(
      <CapacityAmountInput
        onChange={vi.fn()}
        unitOptions={UNIT_OPTIONS}
        value={TEN_MIB_VALUE}
      />
    )

    expect(screen.getByRole('spinbutton')).toHaveValue(10)
    expect(screen.getByText('MiB')).toBeInTheDocument()
  })

  it('renders only the number field when hideUnitSelect is set', () => {
    render(
      <CapacityAmountInput
        hideUnitSelect
        onChange={vi.fn()}
        unitOptions={UNIT_OPTIONS}
        value={TEN_MIB_VALUE}
      />
    )

    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(screen.queryByText('MiB')).not.toBeInTheDocument()
  })

  it('reports the parsed number while keeping the current unit', () => {
    const onChange = vi.fn()
    render(
      <CapacityAmountInput
        onChange={onChange}
        unitOptions={UNIT_OPTIONS}
        value={TEN_MIB_VALUE}
      />
    )

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '5' } })

    expect(onChange).toHaveBeenCalledWith({
      number: 5,
      unit: TEN_MIB_VALUE.unit
    })
  })

  it('reports undefined when the number is cleared', () => {
    const onChange = vi.fn()
    render(
      <CapacityAmountInput
        onChange={onChange}
        unitOptions={UNIT_OPTIONS}
        value={TEN_MIB_VALUE}
      />
    )

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: EMPTY_STRING }
    })

    expect(onChange).toHaveBeenCalledWith({
      number: undefined,
      unit: TEN_MIB_VALUE.unit
    })
  })

  it('reports the selected unit while keeping the current number', () => {
    const onChange = vi.fn()
    render(
      <CapacityAmountInput
        onChange={onChange}
        unitOptions={UNIT_OPTIONS}
        value={TEN_MIB_VALUE}
      />
    )

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(
      screen.getByTestId(`select-option-${UNIT_OPTIONS[1].value}`)
    )

    expect(onChange).toHaveBeenCalledWith({
      number: 10,
      unit: UNIT_OPTIONS[1]
    })
  })
})

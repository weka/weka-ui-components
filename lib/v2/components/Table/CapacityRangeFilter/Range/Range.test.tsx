import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import Range from './Range'

const GIB = { label: 'GiB', value: 1 }
const MIN_INPUT = 'capacity-range-min-input'
const MAX_INPUT = 'capacity-range-max-input'

describe('Range - initial bounds', () => {
  it('renders a zero bound as "0" rather than empty', () => {
    render(
      <Range
        onChange={vi.fn()}
        unitOptions={[GIB]}
        values={{ min: { value: 0, unit: GIB }, max: { value: 0, unit: GIB } }}
      />
    )

    expect(screen.getByTestId(MIN_INPUT)).toHaveDisplayValue('0')
    expect(screen.getByTestId(MAX_INPUT)).toHaveDisplayValue('0')
  })

  it('renders empty inputs when bounds are unset', () => {
    render(
      <Range
        onChange={vi.fn()}
        unitOptions={[GIB]}
        values={{}}
      />
    )

    expect(screen.getByTestId(MIN_INPUT)).toHaveDisplayValue(EMPTY_STRING)
    expect(screen.getByTestId(MAX_INPUT)).toHaveDisplayValue(EMPTY_STRING)
  })
})

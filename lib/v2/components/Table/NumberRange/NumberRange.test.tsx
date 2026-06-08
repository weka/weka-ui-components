import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { NumberRange } from './NumberRange'

const MIN_INPUT = 'number-range-min-input'
const MAX_INPUT = 'number-range-max-input'
const EMPTY_RANGE = { min: null, max: null }
const SEEDED_MIN = 3
const SEEDED_MAX = 9

afterEach(() => {
  cleanup()
})

describe('NumberRange', () => {
  it('renders min and max inputs seeded from initial values', () => {
    render(
      <NumberRange
        initialValues={{ min: SEEDED_MIN, max: SEEDED_MAX }}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByTestId(MIN_INPUT)).toHaveValue(SEEDED_MIN)
    expect(screen.getByTestId(MAX_INPUT)).toHaveValue(SEEDED_MAX)
  })

  it('emits parsed min while keeping max null', () => {
    const onChange = vi.fn()
    render(
      <NumberRange
        initialValues={EMPTY_RANGE}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByTestId(MIN_INPUT), { target: { value: '5' } })
    expect(onChange).toHaveBeenCalledWith({ min: 5, max: null })
  })

  it('emits parsed max while keeping min null', () => {
    const onChange = vi.fn()
    render(
      <NumberRange
        initialValues={EMPTY_RANGE}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByTestId(MAX_INPUT), { target: { value: '10' } })
    expect(onChange).toHaveBeenCalledWith({ min: null, max: 10 })
  })

  it('emits null min when the field is cleared', () => {
    const onChange = vi.fn()
    render(
      <NumberRange
        initialValues={{ min: 4, max: null }}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByTestId(MIN_INPUT), {
      target: { value: EMPTY_STRING }
    })
    expect(onChange).toHaveBeenCalledWith({ min: null, max: null })
  })

  it('ignores a negative min value', () => {
    const onChange = vi.fn()
    render(
      <NumberRange
        initialValues={EMPTY_RANGE}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByTestId(MIN_INPUT), { target: { value: '-5' } })
    expect(onChange).not.toHaveBeenCalled()
  })
})

import { describe, expect, it } from 'vitest'

import {
  hasCapacityNumber,
  withCapacityRequired
} from './formCapacityInput.utils'

const MESSAGE = 'Capacity is required'
const EMPTY = {
  number: undefined,
  unit: { label: undefined, value: undefined }
}
const FILLED = { number: 5, unit: { label: 'GB', value: 1 } }

describe('hasCapacityNumber', () => {
  it('is false for an unset or NaN number', () => {
    expect(hasCapacityNumber(EMPTY)).toBe(false)
    expect(hasCapacityNumber({ ...FILLED, number: Number.NaN })).toBe(false)
    expect(hasCapacityNumber(undefined)).toBe(false)
  })

  it('is true once a number is present', () => {
    expect(hasCapacityNumber(FILLED)).toBe(true)
    expect(hasCapacityNumber({ ...FILLED, number: 0 })).toBe(true)
  })
})

describe('withCapacityRequired', () => {
  it('leaves rules without required untouched', () => {
    const rules = { validate: { positive: () => true } }
    expect(withCapacityRequired(rules)).toBe(rules)
    expect(withCapacityRequired(undefined)).toBeUndefined()
  })

  it('turns a required message into a validator on the number part', () => {
    const rules = withCapacityRequired({ required: MESSAGE })
    const validate = rules?.validate as Record<
      string,
      (value: unknown) => unknown
    >

    expect(rules?.required).toBeUndefined()
    expect(validate.capacityRequired(EMPTY)).toBe(MESSAGE)
    expect(validate.capacityRequired(FILLED)).toBe(true)
  })

  it('keeps the caller validators next to the required one', () => {
    const positive = () => true
    const rules = withCapacityRequired({
      required: { value: true, message: MESSAGE },
      validate: { positive }
    })
    const validate = rules?.validate as Record<string, unknown>

    expect(validate.positive).toBe(positive)
    expect(typeof validate.capacityRequired).toBe('function')
  })

  it('wraps a single validate function', () => {
    const only = () => true
    const rules = withCapacityRequired({ required: true, validate: only })
    const validate = rules?.validate as Record<string, unknown>

    expect(validate.value).toBe(only)
  })
})

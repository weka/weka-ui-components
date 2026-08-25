import { describe, expect, it } from 'vitest'

import { resolveArrowKeyIndex } from './cardRadioGroup.utils'

const OPTION_COUNT = 3

describe('resolveArrowKeyIndex', () => {
  it('moves to the next index on ArrowRight', () => {
    expect(resolveArrowKeyIndex('ArrowRight', 0, OPTION_COUNT)).toBe(1)
  })

  it('moves to the next index on ArrowDown', () => {
    expect(resolveArrowKeyIndex('ArrowDown', 0, OPTION_COUNT)).toBe(1)
  })

  it('wraps to the first index when ArrowRight is pressed on the last option', () => {
    expect(resolveArrowKeyIndex('ArrowRight', 2, OPTION_COUNT)).toBe(0)
  })

  it('moves to the previous index on ArrowLeft', () => {
    expect(resolveArrowKeyIndex('ArrowLeft', 1, OPTION_COUNT)).toBe(0)
  })

  it('moves to the previous index on ArrowUp', () => {
    expect(resolveArrowKeyIndex('ArrowUp', 1, OPTION_COUNT)).toBe(0)
  })

  it('wraps to the last index when ArrowLeft is pressed on the first option', () => {
    expect(resolveArrowKeyIndex('ArrowLeft', 0, OPTION_COUNT)).toBe(2)
  })

  it('jumps to the first index on Home', () => {
    expect(resolveArrowKeyIndex('Home', 2, OPTION_COUNT)).toBe(0)
  })

  it('jumps to the last index on End', () => {
    expect(resolveArrowKeyIndex('End', 0, OPTION_COUNT)).toBe(2)
  })

  it('returns undefined for keys it does not handle', () => {
    expect(resolveArrowKeyIndex('a', 0, OPTION_COUNT)).toBeUndefined()
  })
})

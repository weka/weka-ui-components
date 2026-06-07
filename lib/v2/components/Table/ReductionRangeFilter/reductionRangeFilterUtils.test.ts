import { describe, expect, it } from 'vitest'

import { REDUCTION_RANGE_MODES } from './reductionRangeFilterTypes'
import { isReductionRangeEmpty } from './reductionRangeFilterUtils'

const GB = { label: 'GB', value: 1_000_000_000 }
const TWO = 2

describe('isReductionRangeEmpty', () => {
  it('is empty when ratio mode has no bounds', () => {
    expect(
      isReductionRangeEmpty({
        mode: REDUCTION_RANGE_MODES.RATIO,
        ratio: { min: null, max: null },
        reducedSize: {}
      })
    ).toBe(true)
  })

  it('is not empty when ratio has a bound', () => {
    expect(
      isReductionRangeEmpty({
        mode: REDUCTION_RANGE_MODES.RATIO,
        ratio: { min: TWO, max: null },
        reducedSize: {}
      })
    ).toBe(false)
  })

  it('checks reducedSize bounds in reduced-size mode', () => {
    expect(
      isReductionRangeEmpty({
        mode: REDUCTION_RANGE_MODES.REDUCED_SIZE,
        ratio: { min: null, max: null },
        reducedSize: {}
      })
    ).toBe(true)
    expect(
      isReductionRangeEmpty({
        mode: REDUCTION_RANGE_MODES.REDUCED_SIZE,
        ratio: { min: null, max: null },
        reducedSize: { min: { value: TWO, unit: GB } }
      })
    ).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'

import { syncByNearestTimestamp } from './chartSyncUtils'

const FIRST_TICK = 100
const SECOND_TICK = 200
const THIRD_TICK = 300
const NEAR_FIRST = 110
const NEAR_SECOND = 190
const NEAR_THIRD = 260
const BELOW_RANGE = 50
const ABOVE_RANGE = 350
const NO_SYNC = -1

const ticksAt = (...times: number[]) => times.map((time) => ({ value: time }))
const threeTicks = ticksAt(FIRST_TICK, SECOND_TICK, THIRD_TICK)

describe('syncByNearestTimestamp', () => {
  it('returns the index of the exact matching timestamp', () => {
    const index = syncByNearestTimestamp(threeTicks, {
      activeLabel: SECOND_TICK
    })

    expect(index).toBe(1)
  })

  it('returns the index of the nearest timestamp when there is no exact match', () => {
    const index = syncByNearestTimestamp(threeTicks, {
      activeLabel: NEAR_THIRD
    })

    expect(index).toBe(2)
  })

  it('parses string activeLabel values', () => {
    const index = syncByNearestTimestamp(threeTicks, {
      activeLabel: String(NEAR_FIRST)
    })

    expect(index).toBe(0)
  })

  it('parses string tick values', () => {
    const index = syncByNearestTimestamp(
      [{ value: String(FIRST_TICK) }, { value: String(SECOND_TICK) }],
      { activeLabel: NEAR_SECOND }
    )

    expect(index).toBe(1)
  })

  it('returns -1 when the hovered timestamp is below the data range', () => {
    const index = syncByNearestTimestamp(threeTicks, {
      activeLabel: BELOW_RANGE
    })

    expect(index).toBe(NO_SYNC)
  })

  it('returns -1 when the hovered timestamp is above the data range', () => {
    const index = syncByNearestTimestamp(threeTicks, {
      activeLabel: ABOVE_RANGE
    })

    expect(index).toBe(NO_SYNC)
  })

  it('returns -1 when there is no activeLabel', () => {
    expect(syncByNearestTimestamp(threeTicks, {})).toBe(NO_SYNC)
  })

  it('returns -1 for a non-numeric activeLabel', () => {
    const index = syncByNearestTimestamp(threeTicks, {
      activeLabel: 'not-a-time'
    })

    expect(index).toBe(NO_SYNC)
  })

  it('returns -1 when there are no ticks', () => {
    expect(syncByNearestTimestamp([], { activeLabel: FIRST_TICK })).toBe(
      NO_SYNC
    )
  })
})

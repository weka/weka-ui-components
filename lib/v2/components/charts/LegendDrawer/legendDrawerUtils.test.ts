import { describe, expect, it } from 'vitest'

import {
  DEFAULT_CONTAINER_WIDTH,
  getDrawerDefaultWidth,
  getScaledDrawerWidth
} from './legendDrawerUtils'

const VERY_NARROW_BREAKPOINT = 350
const NARROW_BREAKPOINT = 450
const MEDIUM_BREAKPOINT = 600
const MEDIUM_MAX_WIDTH_RATIO = 0.45
const LARGE_MAX_WIDTH_RATIO = 0.5

describe('getDrawerDefaultWidth', () => {
  it.each([
    { containerWidth: 200, showValues: false, expected: 100 },
    {
      containerWidth: VERY_NARROW_BREAKPOINT,
      showValues: false,
      expected: 100
    },
    { containerWidth: VERY_NARROW_BREAKPOINT, showValues: true, expected: 140 },
    {
      containerWidth: VERY_NARROW_BREAKPOINT + 1,
      showValues: false,
      expected: 110
    },
    { containerWidth: NARROW_BREAKPOINT, showValues: false, expected: 110 },
    { containerWidth: NARROW_BREAKPOINT, showValues: true, expected: 170 },
    { containerWidth: NARROW_BREAKPOINT + 1, showValues: false, expected: 120 },
    { containerWidth: MEDIUM_BREAKPOINT, showValues: false, expected: 120 },
    { containerWidth: MEDIUM_BREAKPOINT, showValues: true, expected: 200 },
    { containerWidth: MEDIUM_BREAKPOINT + 1, showValues: false, expected: 130 },
    { containerWidth: 1200, showValues: true, expected: 230 }
  ])(
    'returns $expected for container $containerWidth (showValues: $showValues)',
    ({ containerWidth, showValues, expected }) => {
      expect(getDrawerDefaultWidth(containerWidth, showValues)).toBe(expected)
    }
  )
})

describe('getScaledDrawerWidth', () => {
  it('clamps a large custom width to the container ratio limit', () => {
    const largeCustomWidth = 500
    const largeContainerRatioLimit = Math.floor(
      DEFAULT_CONTAINER_WIDTH * MEDIUM_MAX_WIDTH_RATIO
    )

    expect(
      getScaledDrawerWidth(DEFAULT_CONTAINER_WIDTH, largeCustomWidth, false)
    ).toBe(largeContainerRatioLimit)
  })

  it('keeps a custom width smaller than the calculated default', () => {
    const smallCustomWidth = 100

    expect(
      getScaledDrawerWidth(DEFAULT_CONTAINER_WIDTH, smallCustomWidth, false)
    ).toBe(smallCustomWidth)
  })

  it('never clamps below the calculated default width for narrow containers', () => {
    const veryNarrowContainer = 300
    const largeCustomWidth = 400
    const calculatedDefaultWithValues = getDrawerDefaultWidth(
      veryNarrowContainer,
      true
    )

    expect(
      getScaledDrawerWidth(veryNarrowContainer, largeCustomWidth, true)
    ).toBe(calculatedDefaultWithValues)
  })

  it('uses the larger ratio limit for wide containers', () => {
    const wideContainer = 1000
    const largeCustomWidth = 800
    const wideContainerRatioLimit = Math.floor(
      wideContainer * LARGE_MAX_WIDTH_RATIO
    )

    expect(getScaledDrawerWidth(wideContainer, largeCustomWidth, false)).toBe(
      wideContainerRatioLimit
    )
  })
})

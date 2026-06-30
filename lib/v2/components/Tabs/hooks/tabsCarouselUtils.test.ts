import { describe, expect, it } from 'vitest'

import {
  calculateLeftScrollTarget,
  calculateRightScrollTarget,
  findFirstVisibleTabIndex
} from './tabsCarouselUtils'

const TAB_WIDTH = 250

const makeTab = (offsetLeft: number): HTMLDivElement =>
  ({ offsetLeft, offsetWidth: TAB_WIDTH } as HTMLDivElement)

const TABS = [
  makeTab(0),
  makeTab(TAB_WIDTH),
  makeTab(TAB_WIDTH * 2),
  makeTab(TAB_WIDTH * 2 + TAB_WIDTH)
]

const VISIBLE_LEFT_INSIDE_THIRD = 260
const VISIBLE_LEFT_WITHIN_THRESHOLD_OF_SECOND = 252
const VISIBLE_LEFT_PAST_ALL = 1000

const SCROLLED_PAST_TWO_TABS = 500
const SCROLLED_PAST_ONE_TAB = TAB_WIDTH
const SCROLLED_NEAR_START = 5

const SECOND_TAB_TARGET = 238
const THIRD_TAB_TARGET = 488

const NARROW_CONTAINER = 600
const WIDE_CONTAINER = 2000

describe('findFirstVisibleTabIndex', () => {
  it('returns the first tab whose left edge is at or past the visible left', () => {
    expect(findFirstVisibleTabIndex(TABS, VISIBLE_LEFT_INSIDE_THIRD)).toBe(2)
  })

  it('tolerates the scroll threshold when matching the boundary', () => {
    expect(
      findFirstVisibleTabIndex(TABS, VISIBLE_LEFT_WITHIN_THRESHOLD_OF_SECOND)
    ).toBe(1)
  })

  it('returns 0 when the first tab is already visible', () => {
    expect(findFirstVisibleTabIndex(TABS, 0)).toBe(0)
  })

  it('returns -1 when no tab is past the visible left', () => {
    expect(findFirstVisibleTabIndex(TABS, VISIBLE_LEFT_PAST_ALL)).toBe(-1)
  })
})

describe('calculateLeftScrollTarget', () => {
  it('scrolls back to the tab before the first visible one', () => {
    expect(calculateLeftScrollTarget(TABS, SCROLLED_PAST_TWO_TABS)).toBe(
      THIRD_TAB_TARGET
    )
  })

  it('clamps the target to 0 (never negative)', () => {
    expect(calculateLeftScrollTarget(TABS, SCROLLED_PAST_ONE_TAB)).toBe(
      SECOND_TAB_TARGET
    )
    expect(calculateLeftScrollTarget(TABS, SCROLLED_NEAR_START)).toBe(0)
  })

  it('returns 0 when already at the start', () => {
    expect(calculateLeftScrollTarget(TABS, 0)).toBe(0)
  })
})

describe('calculateRightScrollTarget', () => {
  it('scrolls to reveal the first tab clipped on the right', () => {
    expect(calculateRightScrollTarget(TABS, 0, NARROW_CONTAINER)).toBe(
      THIRD_TAB_TARGET
    )
  })

  it('returns the current scrollLeft when nothing is clipped on the right', () => {
    expect(calculateRightScrollTarget(TABS, 0, WIDE_CONTAINER)).toBe(0)
  })
})

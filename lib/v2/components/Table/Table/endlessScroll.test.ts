import { describe, expect, it } from 'vitest'

import { shouldLoadMore } from './endlessScroll'

describe('shouldLoadMore', () => {
  it('returns true when intersecting, hasMore, and not loading', () => {
    expect(shouldLoadMore(true, true, false, false)).toBe(true)
  })

  it('returns false when not intersecting', () => {
    expect(shouldLoadMore(false, true, false, false)).toBe(false)
  })

  it('returns false when hasMore is false', () => {
    expect(shouldLoadMore(true, false, false, false)).toBe(false)
  })

  it('returns false when isLoadingMore is true', () => {
    expect(shouldLoadMore(true, true, true, false)).toBe(false)
  })

  it('returns false when the initial query is loading', () => {
    expect(shouldLoadMore(true, true, false, true)).toBe(false)
  })

  it('returns false when hasMore is undefined', () => {
    expect(shouldLoadMore(true, undefined, false, false)).toBe(false)
  })

  it('returns true when isLoadingMore and isLoading are undefined (falsy)', () => {
    expect(shouldLoadMore(true, true, undefined, undefined)).toBe(true)
  })

  it('returns false when all args are false / undefined', () => {
    expect(shouldLoadMore(false, false, false, false)).toBe(false)
  })
})

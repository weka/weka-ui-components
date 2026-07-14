import { describe, expect, it } from 'vitest'

import { resolveSeriesColor } from './seriesColor'

describe('resolveSeriesColor', () => {
  it('returns an already-solid color unchanged', () => {
    expect(resolveSeriesColor('var(--orange-500)')).toBe('var(--orange-500)')
  })

  it('maps a gradient-fade fill reference to its base color token', () => {
    expect(resolveSeriesColor('url(#gradient-blue-fade-500)')).toBe(
      'var(--blue-500)'
    )
    expect(resolveSeriesColor('url(#gradient-aqua-fade-500)')).toBe(
      'var(--aqua-500)'
    )
  })

  it('returns the original reference when the gradient name is unknown', () => {
    const unknownGradient = 'url(#gradient-chartreuse-fade-500)'
    expect(resolveSeriesColor(unknownGradient)).toBe(unknownGradient)
  })
})

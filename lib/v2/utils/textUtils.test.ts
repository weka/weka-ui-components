import { describe, expect, it } from 'vitest'

import { truncateText } from '#v2/utils/textUtils'

const MAX_LENGTH = 13

describe('truncateText', () => {
  it('returns text shorter than the limit unchanged', () => {
    expect(truncateText('short', MAX_LENGTH)).toBe('short')
  })

  it('returns text exactly at the limit unchanged', () => {
    expect(truncateText('exactly-13-ch', MAX_LENGTH)).toBe('exactly-13-ch')
  })

  it('truncates longer text and appends an ellipsis within the limit', () => {
    const result = truncateText('a-very-long-bucket-name', MAX_LENGTH)

    expect(result).toBe('a-very-lon...')
    expect(result).toHaveLength(MAX_LENGTH)
  })
})

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useFieldLabelId } from './useFieldLabelId'

describe('useFieldLabelId', () => {
  it('returns a stable id when a label is given', () => {
    const { result, rerender } = renderHook(() => useFieldLabelId('Name'))
    const firstId = result.current

    rerender()

    expect(firstId).toBeTruthy()
    expect(result.current).toBe(firstId)
  })

  it('returns undefined when there is no label', () => {
    const { result } = renderHook(() => useFieldLabelId(undefined))

    expect(result.current).toBeUndefined()
  })
})

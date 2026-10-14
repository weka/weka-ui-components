import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useErrorDescription } from './useErrorDescription'

const ERROR_TEXT = 'Bad value'
const PARENT_ID = 'parent-error'

describe('useErrorDescription', () => {
  it('has no description without an error or parent id', () => {
    const { result } = renderHook(() => useErrorDescription(undefined))

    expect(result.current.describedBy).toBeUndefined()
  })

  it('references its own error id while an error is set', () => {
    const { result } = renderHook(() => useErrorDescription(ERROR_TEXT))

    expect(result.current.describedBy).toBe(result.current.errorId)
  })

  it('uses only the parent id when there is no own error', () => {
    const { result } = renderHook(() =>
      useErrorDescription(undefined, PARENT_ID)
    )

    expect(result.current.describedBy).toBe(PARENT_ID)
  })

  it('merges the own error id with the parent id', () => {
    const { result } = renderHook(() =>
      useErrorDescription(ERROR_TEXT, PARENT_ID)
    )

    expect(result.current.describedBy).toBe(
      `${result.current.errorId} ${PARENT_ID}`
    )
  })
})

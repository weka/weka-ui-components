import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import useLocalStorage from './useLocalStorage'

const STORAGE_KEY = 'weka-test-key'
const PERSISTED_VALUE = 14
const STORED_VALUE = 10
const REJECTED_VALUE = 20

describe('useLocalStorage', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('yields undefined when the key is absent', () => {
    const { result } = renderHook(() => useLocalStorage<number>(STORAGE_KEY))

    expect(result.current[0]).toBeUndefined()
  })

  it('reads and parses an already stored value', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['alpha', 'beta']))

    const { result } = renderHook(() => useLocalStorage<string[]>(STORAGE_KEY))

    expect(result.current[0]).toEqual(['alpha', 'beta'])
  })

  it('preserves a stored falsy value instead of reporting it as absent', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(0))

    const { result } = renderHook(() => useLocalStorage<number>(STORAGE_KEY))

    expect(result.current[0]).toBe(0)
  })

  it('yields undefined when the stored value is unparsable', () => {
    localStorage.setItem(STORAGE_KEY, '{ not json')

    const { result } = renderHook(() => useLocalStorage<number>(STORAGE_KEY))

    expect(result.current[0]).toBeUndefined()
  })

  it('persists a new value and exposes it to the caller', () => {
    const { result } = renderHook(() => useLocalStorage<number>(STORAGE_KEY))

    act(() => result.current[1](PERSISTED_VALUE))

    expect(result.current[0]).toBe(PERSISTED_VALUE)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(String(PERSISTED_VALUE))
  })

  it('re-reads the stored value when the key changes', () => {
    localStorage.setItem('weka-first-key', JSON.stringify(1))
    localStorage.setItem('weka-second-key', JSON.stringify(2))

    const { result, rerender } = renderHook(
      ({ key }) => useLocalStorage<number>(key),
      { initialProps: { key: 'weka-first-key' } }
    )

    expect(result.current[0]).toBe(1)

    rerender({ key: 'weka-second-key' })

    expect(result.current[0]).toBe(2)
  })

  it('keeps the previous value when writing to storage fails', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STORED_VALUE))

    const { result } = renderHook(() => useLocalStorage<number>(STORAGE_KEY))

    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    act(() => result.current[1](REJECTED_VALUE))

    expect(result.current[0]).toBe(STORED_VALUE)
  })
})

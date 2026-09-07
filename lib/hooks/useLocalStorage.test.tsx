import { StrictMode, useEffect } from 'react'
import { act, render, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NOP } from '#consts'

import localStorageService from '../localStorageService'
import useLocalStorage from './useLocalStorage'

const STORAGE_KEY = 'weka-test-key'
const FIRST_KEY = 'weka-first-key'
const SECOND_KEY = 'weka-second-key'
const FIRST_VALUE = 1
const SECOND_VALUE = 2
const PERSISTED_VALUE = 14
const STORED_VALUE = 10
const REJECTED_VALUE = 20

function StorageConsumer({
  storageKey,
  onCommit = NOP
}: {
  storageKey: string
  onCommit?: (value: number | undefined) => void
}) {
  const [value] = useLocalStorage<number>(storageKey)

  useEffect(() => {
    onCommit(value)
  })

  return null
}

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
    localStorage.setItem(FIRST_KEY, JSON.stringify(FIRST_VALUE))
    localStorage.setItem(SECOND_KEY, JSON.stringify(SECOND_VALUE))

    const { result, rerender } = renderHook(
      ({ key }) => useLocalStorage<number>(key),
      { initialProps: { key: FIRST_KEY } }
    )

    expect(result.current[0]).toBe(FIRST_VALUE)

    rerender({ key: SECOND_KEY })

    expect(result.current[0]).toBe(SECOND_VALUE)
  })

  it('keeps the previous value when writing to storage fails', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STORED_VALUE))

    const { result } = renderHook(() => useLocalStorage<number>(STORAGE_KEY))

    vi.spyOn(localStorageService, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    act(() => result.current[1](REJECTED_VALUE))

    expect(result.current[0]).toBe(STORED_VALUE)
  })

  it('never commits the previous key\'s value once the key changes', () => {
    localStorage.setItem(FIRST_KEY, JSON.stringify(FIRST_VALUE))
    localStorage.setItem(SECOND_KEY, JSON.stringify(SECOND_VALUE))

    const committedValues: (number | undefined)[] = []
    const recordCommit = (value: number | undefined) =>
      committedValues.push(value)

    const { rerender } = render(
      <StorageConsumer onCommit={recordCommit} storageKey={FIRST_KEY} />
    )
    rerender(
      <StorageConsumer onCommit={recordCommit} storageKey={SECOND_KEY} />
    )

    expect(committedValues).toEqual([FIRST_VALUE, SECOND_VALUE])
  })

  it('changes key under StrictMode without emitting React warnings', () => {
    localStorage.setItem(FIRST_KEY, JSON.stringify(FIRST_VALUE))
    localStorage.setItem(SECOND_KEY, JSON.stringify(SECOND_VALUE))

    const consoleError = vi.spyOn(console, 'error').mockImplementation(NOP)

    const { rerender } = render(
      <StrictMode>
        <StorageConsumer storageKey={FIRST_KEY} />
      </StrictMode>
    )
    rerender(
      <StrictMode>
        <StorageConsumer storageKey={SECOND_KEY} />
      </StrictMode>
    )

    expect(consoleError).not.toHaveBeenCalled()
  })
})

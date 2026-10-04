import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { toastSuccess } from '#v2/utils/toast'

import { useFormPopupSubmit } from './useFormPopupSubmit'

vi.mock('#v2/utils/toast', () => ({ toastSuccess: vi.fn() }))

const FALLBACK = 'Something went wrong'
const BAD_REQUEST = 'bad request'

describe('useFormPopupSubmit', () => {
  it('starts with isSubmitting false and no error', () => {
    const { result } = renderHook(() =>
      useFormPopupSubmit(vi.fn(), { errorFallbackMessage: FALLBACK })
    )

    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('toggles isSubmitting around a successful submit', async () => {
    let resolveSubmit: () => void = () => undefined
    const submitFn = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        })
    )
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, { errorFallbackMessage: FALLBACK })
    )

    let submitPromise: Promise<unknown> = Promise.resolve()
    act(() => {
      submitPromise = result.current.submit({})
    })
    expect(result.current.isSubmitting).toBe(true)

    await act(async () => {
      resolveSubmit()
      await submitPromise
    })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('shows a success toast, then runs onSuccess, then onClose', async () => {
    const callOrder: string[] = []
    const submitFn = vi.fn(() => {
      callOrder.push('submitFn')
      return Promise.resolve()
    })
    vi.mocked(toastSuccess).mockImplementationOnce(() => {
      callOrder.push('toastSuccess')
    })
    const onSuccess = vi.fn(() => {
      callOrder.push('onSuccess')
    })
    const onClose = vi.fn(() => {
      callOrder.push('onClose')
    })
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, {
        errorFallbackMessage: FALLBACK,
        successMessage: 'Saved',
        onSuccess,
        onClose
      })
    )

    await act(async () => {
      await result.current.submit({})
    })

    expect(callOrder).toEqual([
      'submitFn',
      'toastSuccess',
      'onSuccess',
      'onClose'
    ])
    expect(toastSuccess).toHaveBeenCalledWith('Saved')
  })

  it('skips the toast, onSuccess, and onClose when none are provided', async () => {
    const submitFn = vi.fn(() => Promise.resolve())
    vi.mocked(toastSuccess).mockClear()
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, { errorFallbackMessage: FALLBACK })
    )

    await act(async () => {
      await result.current.submit({})
    })

    expect(toastSuccess).not.toHaveBeenCalled()
  })

  it('resolves a rejected submit into the returned error state and stays open', async () => {
    const submitFn = vi.fn(() => Promise.reject(new Error(BAD_REQUEST)))
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, {
        errorFallbackMessage: FALLBACK,
        onClose
      })
    )

    await act(async () => {
      await result.current.submit({})
    })

    expect(result.current.error).toBe(BAD_REQUEST)
    expect(result.current.isSubmitting).toBe(false)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('falls back to errorFallbackMessage when the error carries no message', async () => {
    const submitFn = vi.fn().mockRejectedValue({ status: 500 })
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, { errorFallbackMessage: FALLBACK })
    )

    await act(async () => {
      await result.current.submit({})
    })

    expect(result.current.error).toBe(FALLBACK)
  })

  it('clears a previous error at the start of the next submit', async () => {
    const submitFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockImplementationOnce(() => new Promise<void>(() => undefined))
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, { errorFallbackMessage: FALLBACK })
    )

    await act(async () => {
      await result.current.submit({})
    })
    expect(result.current.error).toBe('first failure')

    act(() => {
      void result.current.submit({})
    })
    expect(result.current.error).toBeUndefined()
  })

  it('clears the error state via resetError outside of a submit', async () => {
    const submitFn = vi.fn().mockRejectedValue(new Error(BAD_REQUEST))
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, { errorFallbackMessage: FALLBACK })
    )

    await act(async () => {
      await result.current.submit({})
    })
    expect(result.current.error).toBe(BAD_REQUEST)

    act(() => {
      result.current.resetError()
    })
    expect(result.current.error).toBeUndefined()
  })

  it('routes the resolved message through onError instead of the error state', async () => {
    const submitFn = vi.fn(() => Promise.reject(new Error(BAD_REQUEST)))
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useFormPopupSubmit(submitFn, {
        errorFallbackMessage: FALLBACK,
        onError
      })
    )

    await act(async () => {
      await result.current.submit({})
    })

    expect(onError).toHaveBeenCalledWith(BAD_REQUEST)
    expect(result.current.error).toBeUndefined()
  })
})

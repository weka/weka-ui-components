import { beforeEach, describe, expect, it, vi } from 'vitest'

const toastMock = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  dismiss: vi.fn()
}))

vi.mock('sonner', () => ({ toast: toastMock }))

import {
  toastDismissAll,
  toastError,
  toastInfo,
  toastSuccess,
  toastWarning
} from '#v2/utils/toast'

const DATA_PAYLOAD_MESSAGE = 'Quota exceeded'

describe('toast helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toastSuccess delegates to toast.success', () => {
    toastSuccess('Saved')
    expect(toastMock.success).toHaveBeenCalledWith('Saved')
  })

  it('toastInfo delegates to toast.info', () => {
    toastInfo('Heads up')
    expect(toastMock.info).toHaveBeenCalledWith('Heads up')
  })

  it('toastWarning delegates to toast.warning', () => {
    toastWarning('Careful')
    expect(toastMock.warning).toHaveBeenCalledWith('Careful')
  })

  it('toastDismissAll dismisses every toast', () => {
    toastDismissAll()
    expect(toastMock.dismiss).toHaveBeenCalledWith()
  })

  describe('toastError', () => {
    it('shows a string message verbatim', () => {
      toastError('Something failed')
      expect(toastMock.error).toHaveBeenCalledWith('Something failed', {
        id: undefined
      })
    })

    it('extracts the message from an Error-like object', () => {
      toastError({ message: 'Network down' })
      expect(toastMock.error).toHaveBeenCalledWith('Network down', {
        id: undefined
      })
    })

    it('extracts a string data payload from an API error', () => {
      toastError({ data: DATA_PAYLOAD_MESSAGE })
      expect(toastMock.error).toHaveBeenCalledWith(DATA_PAYLOAD_MESSAGE, {
        id: undefined
      })
    })

    it('extracts a nested data.error message from an API error', () => {
      toastError({ data: { error: 'Filesystem is busy' } })
      expect(toastMock.error).toHaveBeenCalledWith('Filesystem is busy', {
        id: undefined
      })
    })

    it('prefers the top-level message over the data payload', () => {
      toastError({ message: 'Request failed', data: DATA_PAYLOAD_MESSAGE })
      expect(toastMock.error).toHaveBeenCalledWith('Request failed', {
        id: undefined
      })
    })

    it('falls back to a generic message for unknown shapes', () => {
      toastError({})
      expect(toastMock.error).toHaveBeenCalledWith('An error occurred', {
        id: undefined
      })
    })

    it('falls back to a generic message for a non-string data.error', () => {
      toastError({ data: { error: 42 } })
      expect(toastMock.error).toHaveBeenCalledWith('An error occurred', {
        id: undefined
      })
    })

    it('forwards the toastId as the sonner id', () => {
      toastError('Retry failed', undefined, 'retry-toast')
      expect(toastMock.error).toHaveBeenCalledWith('Retry failed', {
        id: 'retry-toast'
      })
    })
  })
})

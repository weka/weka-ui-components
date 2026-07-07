import { toast } from 'sonner'

const DEFAULT_ERROR_MESSAGE = 'An error occurred'

export const toastSuccess = (message: string) => {
  toast.success(message)
}

const getDataPayloadMessage = (data: unknown): string | null => {
  if (typeof data === 'string') {
    return data
  }
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof data.error === 'string'
  ) {
    return data.error
  }
  return null
}

/**
 * Extracts a display message from the error shapes the legacy
 * `Utils.toastError` supported: a plain string, `{ message }`, an API payload
 * `{ data: string }`, or a nested `{ data: { error: string } }`.
 */
const getToastErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }
  if (!error || typeof error !== 'object') {
    return DEFAULT_ERROR_MESSAGE
  }
  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }
  if ('data' in error) {
    return getDataPayloadMessage(error.data) ?? DEFAULT_ERROR_MESSAGE
  }
  return DEFAULT_ERROR_MESSAGE
}

/**
 * Signature mirrors the legacy `Utils.toastError` (hence the unused `_options`)
 * so existing call sites migrate unchanged.
 */
export const toastError = (
  message: unknown,
  _options?: unknown,
  toastId?: string
) => {
  toast.error(getToastErrorMessage(message), { id: toastId })
}

export const toastInfo = (message: string) => {
  toast.info(message)
}

export const toastWarning = (message: string) => {
  toast.warning(message)
}

export const toastDismissAll = () => {
  toast.dismiss()
}

export { toast }

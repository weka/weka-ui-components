function extractFromData(data: unknown): string | null {
  if (typeof data === 'string') {
    return data
  }
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  ) {
    return (data as { error: string }).error
  }
  return null
}

function extractFromObject(error: object, fallback: string): string {
  if (
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }
  if (
    'detail' in error &&
    typeof (error as { detail: unknown }).detail === 'string'
  ) {
    return (error as { detail: string }).detail
  }
  if ('data' in error) {
    return extractFromData((error as { data: unknown }).data) ?? fallback
  }
  return fallback
}

/**
 * Extract a human-readable message from an API/submit error: string / .message /
 * RFC7807 .detail (wrest/v3 error bodies) / .data / .data.error (the legacy v2
 * shape, also used by the shared toastError helper). Falls back to the
 * caller-supplied translated fallback.
 */
export function getFormErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object') {
    return extractFromObject(error, fallback)
  }
  return fallback
}

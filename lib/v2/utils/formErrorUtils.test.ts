import { describe, expect, it } from 'vitest'

import { getFormErrorMessage } from '#v2/utils/formErrorUtils'

const FALLBACK = 'Something went wrong'

describe('getFormErrorMessage', () => {
  it('returns a plain string error as-is', () => {
    expect(getFormErrorMessage('boom', FALLBACK)).toBe('boom')
  })

  it('prefers .message when present', () => {
    expect(getFormErrorMessage(new Error('bad request'), FALLBACK)).toBe(
      'bad request'
    )
  })

  it('reads the RFC7807 .detail field from a v3 error body', () => {
    expect(
      getFormErrorMessage(
        { title: 'Unauthorized', status: 401, detail: 'Invalid old password' },
        FALLBACK
      )
    ).toBe('Invalid old password')
  })

  it('reads the legacy v2 .data string', () => {
    expect(
      getFormErrorMessage({ data: 'Invalid username or password' }, FALLBACK)
    ).toBe('Invalid username or password')
  })

  it('reads the legacy v2 .data.error shape', () => {
    expect(getFormErrorMessage({ data: { error: 'nope' } }, FALLBACK)).toBe(
      'nope'
    )
  })

  it('falls back when nothing usable is present', () => {
    expect(getFormErrorMessage({ status: 500 }, FALLBACK)).toBe(FALLBACK)
    expect(getFormErrorMessage(undefined, FALLBACK)).toBe(FALLBACK)
    expect(getFormErrorMessage(null, FALLBACK)).toBe(FALLBACK)
  })
})

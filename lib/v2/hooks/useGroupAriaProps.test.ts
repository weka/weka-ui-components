import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useGroupAriaProps } from './useGroupAriaProps'

const LABEL = 'IP address'
const ARIA_LABEL = 'Start IP'
const EXTERNAL_LABEL_ID = 'external-label'

describe('useGroupAriaProps', () => {
  it('references its own label id when a visible label is rendered', () => {
    const { result } = renderHook(() =>
      useGroupAriaProps({
        label: LABEL,
        ariaLabel: ARIA_LABEL,
        ariaLabelledBy: EXTERNAL_LABEL_ID
      })
    )

    expect(result.current.groupProps).toEqual({
      role: 'group',
      'aria-labelledby': result.current.labelId,
      'aria-label': undefined
    })
  })

  it('references the external label when there is no visible label', () => {
    const { result } = renderHook(() =>
      useGroupAriaProps({
        ariaLabel: ARIA_LABEL,
        ariaLabelledBy: EXTERNAL_LABEL_ID
      })
    )

    expect(result.current.groupProps['aria-labelledby']).toBe(EXTERNAL_LABEL_ID)
    expect(result.current.groupProps['aria-label']).toBeUndefined()
  })

  it('falls back to ariaLabel when nothing else names the group', () => {
    const { result } = renderHook(() =>
      useGroupAriaProps({ ariaLabel: ARIA_LABEL })
    )

    expect(result.current.groupProps['aria-label']).toBe(ARIA_LABEL)
    expect(result.current.groupProps['aria-labelledby']).toBeUndefined()
  })
})

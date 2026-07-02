import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './Spinner'

const EXPECTED_DOT_COUNT = 4

describe('Spinner', () => {
  it('renders the spinner container', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders four animated dots', () => {
    const { container } = render(<Spinner />)
    const dots = container.querySelectorAll('[class*="spinnerDot"]')
    expect(dots).toHaveLength(EXPECTED_DOT_COUNT)
  })
})

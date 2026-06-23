import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatBoxSkeleton } from './StatBoxSkeleton'

describe('StatBoxSkeleton', () => {
  it('renders the loading variant with aria-busy', () => {
    render(
      <StatBoxSkeleton
        showSubStats
        status='loading'
      />
    )

    const skeleton = screen.getByTestId('stat-box-skeleton-loading')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-busy', 'true')
  })

  it('renders the error variant without aria-busy', () => {
    render(
      <StatBoxSkeleton
        showSubStats
        status='error'
      />
    )

    const skeleton = screen.getByTestId('stat-box-skeleton-error')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-busy', 'false')
  })

  it('omits the sub-stat bars when showSubStats is false', () => {
    const { container } = render(
      <StatBoxSkeleton
        showSubStats={false}
        status='loading'
      />
    )

    expect(container.querySelectorAll('div')).toHaveLength(2)
  })
})

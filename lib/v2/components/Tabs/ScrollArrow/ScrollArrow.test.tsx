import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SCROLL_DIRECTIONS } from '../tabsConstants'
import { ScrollArrow } from './ScrollArrow'

describe('ScrollArrow', () => {
  it('renders a left-scroll button with an accessible label', () => {
    render(
      <ScrollArrow
        direction={SCROLL_DIRECTIONS.LEFT}
        onClick={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Scroll left' })
    ).toBeInTheDocument()
  })

  it('renders a right-scroll button with an accessible label', () => {
    render(
      <ScrollArrow
        direction={SCROLL_DIRECTIONS.RIGHT}
        onClick={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Scroll right' })
    ).toBeInTheDocument()
  })

  it('calls onClick when enabled', () => {
    const onClick = vi.fn()
    render(
      <ScrollArrow
        direction={SCROLL_DIRECTIONS.LEFT}
        onClick={onClick}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Scroll left' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(
      <ScrollArrow
        direction={SCROLL_DIRECTIONS.RIGHT}
        disabled
        onClick={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Scroll right' })).toBeDisabled()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomTick } from './CustomTick'

const renderTick = (props: Parameters<typeof CustomTick>[0]) =>
  render(
    <svg>
      <CustomTick {...props} />
    </svg>
  )

describe('CustomTick', () => {
  it('renders a raw string value as a single line', () => {
    renderTick({ payload: { value: 'label' } })

    expect(screen.getByText('label')).toBeInTheDocument()
  })

  it('formats a numeric timestamp as time for short ranges', () => {
    const timestamp = new Date('2024-03-15T14:30:00Z').getTime()

    renderTick({ payload: { value: timestamp }, range: '1h' })

    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument()
  })

  it('renders date and time as two lines for long ranges', () => {
    const timestamp = new Date('2024-03-15T14:30:00Z').getTime()

    const { container } = renderTick({
      payload: { value: timestamp },
      range: '7d'
    })

    expect(container.querySelectorAll('text')).toHaveLength(2)
  })

  it('renders a numeric value without a range as-is', () => {
    renderTick({ payload: { value: 42 } })

    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('positions the tick at the given coordinates', () => {
    const { container } = renderTick({
      payload: { value: 'label' },
      x: 10,
      y: 20
    })

    expect(container.querySelector('g')).toHaveAttribute(
      'transform',
      'translate(10,20)'
    )
  })
})

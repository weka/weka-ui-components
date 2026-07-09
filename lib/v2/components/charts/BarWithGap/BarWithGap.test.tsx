import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { BarWithGap } from './BarWithGap'

const renderBar = (props: Parameters<typeof BarWithGap>[0]) =>
  render(
    <svg>
      <BarWithGap {...props} />
    </svg>
  )

describe('BarWithGap', () => {
  it('renders a rounded-top path with the given fill', () => {
    const { container } = renderBar({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
      fill: 'var(--cyan-500)'
    })

    const path = container.querySelector('path')
    expect(path).toHaveAttribute('fill', 'var(--cyan-500)')
    expect(path?.getAttribute('d')).toContain('M 10,24')
  })

  it('renders an empty path for zero height', () => {
    const { container } = renderBar({
      x: 10,
      y: 20,
      width: 30,
      height: 0,
      fill: 'red'
    })

    expect(container.querySelector('path')).toHaveAttribute('d', EMPTY_STRING)
  })

  it('renders an empty path for negative height', () => {
    const { container } = renderBar({
      x: 10,
      y: 20,
      width: 30,
      height: -5,
      fill: 'red'
    })

    expect(container.querySelector('path')).toHaveAttribute('d', EMPTY_STRING)
  })
})

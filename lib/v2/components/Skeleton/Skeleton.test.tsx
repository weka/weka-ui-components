import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders the shimmer element', () => {
    render(<Skeleton dataTestId='skeleton' />)
    expect(screen.getByTestId('skeleton')).toHaveClass('skeleton')
  })

  it('applies numeric width and height as pixels', () => {
    render(
      <Skeleton
        dataTestId='skeleton'
        height={20}
        width={130}
      />
    )
    const box = screen.getByTestId('skeleton')
    expect(box).toHaveStyle({ width: '130px', height: '20px' })
  })

  it('applies string dimensions verbatim', () => {
    render(
      <Skeleton
        dataTestId='skeleton'
        width='100%'
      />
    )
    expect(screen.getByTestId('skeleton')).toHaveStyle({ width: '100%' })
  })

  it('defaults border radius to 4px', () => {
    render(<Skeleton dataTestId='skeleton' />)
    expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: '4px' })
  })

  it('applies a custom border radius', () => {
    render(
      <Skeleton
        borderRadius='50%'
        dataTestId='skeleton'
      />
    )
    expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: '50%' })
  })

  it('merges an extra class alongside the shimmer class', () => {
    render(
      <Skeleton
        dataTestId='skeleton'
        extraClass='custom'
      />
    )
    const box = screen.getByTestId('skeleton')
    expect(box).toHaveClass('skeleton')
    expect(box).toHaveClass('custom')
  })
})

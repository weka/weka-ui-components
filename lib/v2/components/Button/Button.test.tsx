import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

function TestIcon({
  color,
  width,
  height
}: Readonly<{
  color?: string
  width?: number
  height?: number
}>) {
  return (
    <svg
      data-testid='test-icon'
      fill={color}
      height={height}
      width={width}
    >
      <circle
        cx='10'
        cy='10'
        r='5'
      />
    </svg>
  )
}

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>)
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument()
    })

    it('renders with default type="button"', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('renders with primary variant by default', () => {
      const { container } = render(<Button>Click me</Button>)
      const button = container.querySelector('button')
      expect(button?.className).toContain('primary')
    })

    it('renders with rounded style by default', () => {
      const { container } = render(<Button>Click me</Button>)
      const button = container.querySelector('button')
      expect(button?.className).toContain('isRounded')
    })

    it('renders without rounded style when isRounded is false', () => {
      const { container } = render(<Button isRounded={false}>Click me</Button>)
      const button = container.querySelector('button')
      expect(button?.className).not.toContain('isRounded')
    })

    it('renders with data-testid when provided', () => {
      render(<Button dataTestId='my-button'>Click me</Button>)
      expect(screen.getByTestId('my-button')).toBeInTheDocument()
    })

    it('renders with title attribute when provided', () => {
      render(<Button title='Button title'>Click me</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'title',
        'Button title'
      )
    })

    it('renders icon when Icon prop is provided', () => {
      render(<Button Icon={TestIcon}>Click me</Button>)
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('applies hasIcon class when Icon is provided', () => {
      const { container } = render(<Button Icon={TestIcon}>Click me</Button>)
      const button = container.querySelector('button')
      expect(button?.className).toContain('hasIcon')
    })

    it('does not render icon when Icon prop is not provided', () => {
      render(<Button>Click me</Button>)
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })

    it('applies extraClass when provided', () => {
      const { container } = render(
        <Button extraClass='custom-class'>Click me</Button>
      )
      const button = container.querySelector('button')
      expect(button?.className).toContain('custom-class')
    })
  })

  describe('Variants', () => {
    it('renders primary variant', () => {
      const { container } = render(<Button variant='primary'>Click me</Button>)
      const button = container.querySelector('button')
      expect(button?.className).toContain('primary')
    })

    it('renders secondary variant', () => {
      const { container } = render(
        <Button variant='secondary'>Click me</Button>
      )
      const button = container.querySelector('button')
      expect(button?.className).toContain('secondary')
    })
  })

  describe('Button types', () => {
    it.each([
      { type: 'button' as const },
      { type: 'submit' as const },
      { type: 'reset' as const }
    ])('renders with type="$type"', ({ type }) => {
      render(<Button type={type}>Click me</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', type)
    })
  })

  describe('User Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(
        <Button
          disabled
          onClick={handleClick}
        >
          Click me
        </Button>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('renders as disabled when disabled prop is true', () => {
      render(<Button disabled>Click me</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('renders as enabled by default', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeEnabled()
    })
  })
})

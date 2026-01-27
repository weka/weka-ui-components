import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('does not show children when loading', () => {
    render(<Button loading>Hidden text</Button>)
    expect(screen.queryByText('Hidden text')).not.toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant='primary'>Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('primary')

    rerender(<Button variant='secondary'>Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('secondary')

    rerender(<Button variant='outline'>Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('outline')
  })

  it('applies size classes', () => {
    const { rerender } = render(<Button size='small'>Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('small')

    rerender(<Button size='medium'>Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('medium')

    rerender(<Button size='large'>Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('large')
  })

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>)
    expect(screen.getByRole('button')).toHaveClass('fullWidth')
  })

  it('has correct button type', () => {
    const { rerender } = render(<Button type='submit'>Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')

    rerender(<Button type='reset'>Reset</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')

    rerender(<Button>Default</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})

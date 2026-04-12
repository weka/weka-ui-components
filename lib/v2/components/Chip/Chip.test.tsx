import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Chip } from './Chip'

const getChipContainer = (container: HTMLElement) =>
  container.firstChild as HTMLElement

describe('Chip - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with children text', () => {
    render(<Chip>Test Label</Chip>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders without close button by default', () => {
    render(<Chip>Test Label</Chip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders close button when closable is true', () => {
    render(<Chip closable>Test Label</Chip>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies extraClass when provided', () => {
    const { container } = render(<Chip extraClass='custom-class'>Test</Chip>)
    const chip = getChipContainer(container)
    expect(chip.className).toContain('custom-class')
  })

  it('applies backgroundColor style when provided', () => {
    const { container } = render(<Chip backgroundColor='#ff0000'>Test</Chip>)
    const chip = getChipContainer(container)
    expect(chip).toHaveStyle({ backgroundColor: '#ff0000' })
  })

  it('applies textColor style when provided', () => {
    const { container } = render(<Chip textColor='#00ff00'>Test</Chip>)
    const chip = getChipContainer(container)
    expect(chip).toHaveStyle({ color: '#00ff00' })
  })

  it('applies maxWidth style when provided', () => {
    const { container } = render(<Chip maxWidth='100px'>Test</Chip>)
    const chip = getChipContainer(container)
    expect(chip).toHaveStyle({ maxWidth: '100px' })
  })

  it('applies multiple custom styles simultaneously', () => {
    const { container } = render(
      <Chip
        backgroundColor='#ff0000'
        maxWidth='150px'
        textColor='#ffffff'
      >
        Test
      </Chip>
    )
    const chip = getChipContainer(container)
    expect(chip).toHaveStyle({
      backgroundColor: '#ff0000',
      color: '#ffffff',
      maxWidth: '150px'
    })
  })

  it('renders complex children (React nodes)', () => {
    render(
      <Chip>
        <span data-testid='inner-element'>Complex content</span>
      </Chip>
    )
    expect(screen.getByTestId('inner-element')).toBeInTheDocument()
    expect(screen.getByText('Complex content')).toBeInTheDocument()
  })
})

describe('Chip - User Interactions', () => {
  it('calls onClick when chip is clicked', () => {
    const handleClick = vi.fn()
    render(<Chip onClick={handleClick}>Test Label</Chip>)

    fireEvent.click(screen.getByText('Test Label'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Chip
        closable
        onClose={handleClose}
      >
        Test Label
      </Chip>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not throw when closable but no onClose handler provided', () => {
    render(<Chip closable>Test Label</Chip>)

    expect(() => {
      fireEvent.click(screen.getByRole('button'))
    }).not.toThrow()
  })
})

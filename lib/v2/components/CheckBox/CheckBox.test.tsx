import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { Checkbox } from './CheckBox'

vi.mock('../../icons', () => ({
  CheckboxCheckedIcon: (props: Record<string, unknown>) => (
    <svg data-testid='checkbox-checked-icon' {...props} />
  ),
  CheckboxUncheckedIcon: (props: Record<string, unknown>) => (
    <svg data-testid='checkbox-unchecked-icon' {...props} />
  ),
  CheckboxPartialIcon: (props: Record<string, unknown>) => (
    <svg data-testid='checkbox-partial-icon' {...props} />
  )
}))

describe('Checkbox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders unchecked icon when checked is false', () => {
      render(<Checkbox checked={false} onChange={vi.fn()} />)
      expect(screen.getByTestId('checkbox-unchecked-icon')).toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-checked-icon')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-partial-icon')
      ).not.toBeInTheDocument()
    })

    it('renders checked icon when checked is true', () => {
      render(<Checkbox checked={true} onChange={vi.fn()} />)
      expect(screen.getByTestId('checkbox-checked-icon')).toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-unchecked-icon')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-partial-icon')
      ).not.toBeInTheDocument()
    })

    it('renders partial icon when partiallyChecked is true', () => {
      render(<Checkbox checked={false} onChange={vi.fn()} partiallyChecked />)
      expect(screen.getByTestId('checkbox-partial-icon')).toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-unchecked-icon')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-checked-icon')
      ).not.toBeInTheDocument()
    })

    it('renders partial icon over checked icon when both are true', () => {
      render(<Checkbox checked={true} onChange={vi.fn()} partiallyChecked />)
      expect(screen.getByTestId('checkbox-partial-icon')).toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-checked-icon')
      ).not.toBeInTheDocument()
    })

    it('renders with data-testid="custom-checkbox"', () => {
      render(<Checkbox checked={false} onChange={vi.fn()} />)
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument()
    })

    it('applies wrapperClass when provided', () => {
      render(
        <Checkbox
          checked={false}
          onChange={vi.fn()}
          wrapperClass='custom-class'
        />
      )
      const checkbox = screen.getByTestId('custom-checkbox')
      expect(checkbox).toHaveClass('custom-class')
    })
  })

  describe('User Interactions', () => {
    it('calls onChange with true when unchecked checkbox is clicked', () => {
      const handleChange = vi.fn()
      render(<Checkbox checked={false} onChange={handleChange} />)

      fireEvent.click(screen.getByTestId('custom-checkbox'))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('calls onChange with false when checked checkbox is clicked', () => {
      const handleChange = vi.fn()
      render(<Checkbox checked={true} onChange={handleChange} />)

      fireEvent.click(screen.getByTestId('custom-checkbox'))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('stops event propagation when clicked', () => {
      const handleChange = vi.fn()
      const parentClick = vi.fn()

      render(
        <div onClick={parentClick}>
          <Checkbox checked={false} onChange={handleChange} />
        </div>
      )

      fireEvent.click(screen.getByTestId('custom-checkbox'))

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(parentClick).not.toHaveBeenCalled()
    })
  })

  describe('Icon State Transitions', () => {
    it('updates icon when checked state changes', () => {
      const handleChange = vi.fn()
      const { rerender } = render(
        <Checkbox checked={false} onChange={handleChange} />
      )

      expect(screen.getByTestId('checkbox-unchecked-icon')).toBeInTheDocument()

      rerender(<Checkbox checked={true} onChange={handleChange} />)

      expect(screen.getByTestId('checkbox-checked-icon')).toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-unchecked-icon')
      ).not.toBeInTheDocument()
    })

    it('updates icon when partiallyChecked state changes', () => {
      const handleChange = vi.fn()
      const { rerender } = render(
        <Checkbox checked={false} onChange={handleChange} />
      )

      expect(screen.getByTestId('checkbox-unchecked-icon')).toBeInTheDocument()

      rerender(
        <Checkbox checked={false} onChange={handleChange} partiallyChecked />
      )

      expect(screen.getByTestId('checkbox-partial-icon')).toBeInTheDocument()
      expect(
        screen.queryByTestId('checkbox-unchecked-icon')
      ).not.toBeInTheDocument()
    })
  })
})

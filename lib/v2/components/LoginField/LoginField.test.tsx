import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { EMPTY_STRING } from '../../utils/consts'
import { LoginField } from './LoginField'

describe('LoginField', () => {
  const defaultProps = {
    label: 'Email',
    value: EMPTY_STRING,
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders label text', () => {
      render(<LoginField {...defaultProps} />)

      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('renders input with value', () => {
      render(<LoginField {...defaultProps} value='test@example.com' />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('test@example.com')
    })

    it('renders input with default type text', () => {
      render(<LoginField {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders input with custom type', () => {
      render(<LoginField {...defaultProps} type='password' />)

      const input = document.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
    })

    it('renders required indicator when isRequired is true', () => {
      render(<LoginField {...defaultProps} isRequired />)

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('does not render required indicator when isRequired is false', () => {
      render(<LoginField {...defaultProps} isRequired={false} />)

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('renders error message when error prop is provided', () => {
      render(<LoginField {...defaultProps} error='Invalid email' />)

      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('does not render error message when error prop is not provided', () => {
      const { container } = render(<LoginField {...defaultProps} />)

      const errorElement = container.querySelector('[class*="errorMessage"]')
      expect(errorElement).not.toBeInTheDocument()
    })

    it('applies data-testid to input', () => {
      render(<LoginField {...defaultProps} dataTestId='email-input' />)

      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onChange with input value when user types', () => {
      const handleChange = vi.fn()
      render(<LoginField {...defaultProps} onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })

      expect(handleChange).toHaveBeenCalledWith('test')
    })
  })

  describe('Input States', () => {
    it('disables input when disabled prop is true', () => {
      render(<LoginField {...defaultProps} disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('enables input when disabled prop is false', () => {
      render(<LoginField {...defaultProps} disabled={false} />)

      const input = screen.getByRole('textbox')
      expect(input).not.toBeDisabled()
    })

    it('applies autoFocus when autoFocus prop is true', () => {
      render(<LoginField {...defaultProps} autoFocus />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })
  })

  describe('Styling', () => {
    it('applies error class to input when error prop is provided', () => {
      render(<LoginField {...defaultProps} error='Error' />)

      const input = screen.getByRole('textbox')
      expect(input.className).toContain('inputError')
    })

    it('does not apply error class when no error', () => {
      render(<LoginField {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input.className).not.toContain('inputError')
    })

    it('applies required class to asterisk', () => {
      render(<LoginField {...defaultProps} isRequired />)

      const asterisk = screen.getByText('*')
      expect(asterisk.className).toContain('required')
    })
  })
})

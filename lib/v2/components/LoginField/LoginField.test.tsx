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
    it('renders label connected to input', () => {
      render(<LoginField {...defaultProps} />)

      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('renders input with value', () => {
      render(
        <LoginField
          {...defaultProps}
          value='test@example.com'
        />
      )

      expect(screen.getByLabelText('Email')).toHaveValue(
        'test@example.com'
      )
    })

    it('renders input with default type text', () => {
      render(<LoginField {...defaultProps} />)

      expect(screen.getByLabelText('Email')).toHaveAttribute(
        'type',
        'text'
      )
    })

    it('renders input with custom type', () => {
      render(
        <LoginField
          {...defaultProps}
          type='password'
        />
      )

      const input = document.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
    })

    it('renders required indicator when isRequired is true', () => {
      render(
        <LoginField
          {...defaultProps}
          isRequired
        />
      )

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('does not render required indicator when isRequired is false', () => {
      render(
        <LoginField
          {...defaultProps}
          isRequired={false}
        />
      )

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('renders error message when error prop is provided', () => {
      render(
        <LoginField
          {...defaultProps}
          error='Invalid email'
        />
      )

      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('does not render error message when error prop is not provided', () => {
      const { container } = render(<LoginField {...defaultProps} />)

      const errorElement = container.querySelector(
        '[class*="errorMessage"]'
      )
      expect(errorElement).not.toBeInTheDocument()
    })

    it('applies data-testid to input', () => {
      render(
        <LoginField
          {...defaultProps}
          dataTestId='email-input'
        />
      )

      expect(screen.getByTestId('email-input')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onChange with input value when user types', () => {
      const handleChange = vi.fn()
      render(
        <LoginField
          {...defaultProps}
          onChange={handleChange}
        />
      )

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test' }
      })

      expect(handleChange).toHaveBeenCalledWith('test')
    })
  })

  describe('Input States', () => {
    it('disables input when disabled prop is true', () => {
      render(
        <LoginField
          {...defaultProps}
          disabled
        />
      )

      expect(screen.getByLabelText('Email')).toBeDisabled()
    })

    it('enables input when disabled prop is false', () => {
      render(
        <LoginField
          {...defaultProps}
          disabled={false}
        />
      )

      expect(screen.getByLabelText('Email')).not.toBeDisabled()
    })

    it('applies autoFocus when autoFocus prop is true', () => {
      render(
        <LoginField
          {...defaultProps}
          autoFocus
        />
      )

      expect(screen.getByLabelText('Email')).toHaveFocus()
    })
  })

  describe('Styling', () => {
    it('applies error class to input when error prop is provided', () => {
      render(
        <LoginField
          {...defaultProps}
          error='Error'
        />
      )

      expect(screen.getByLabelText('Email').className).toContain(
        'inputError'
      )
    })

    it('does not apply error class when no error', () => {
      render(<LoginField {...defaultProps} />)

      expect(
        screen.getByLabelText('Email').className
      ).not.toContain('inputError')
    })

    it('applies required class to asterisk', () => {
      render(
        <LoginField
          {...defaultProps}
          isRequired
        />
      )

      const asterisk = screen.getByText('*')
      expect(asterisk.className).toContain('required')
    })
  })
})

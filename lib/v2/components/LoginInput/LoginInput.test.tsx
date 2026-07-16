import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { LoginInput } from './LoginInput'

const SHOW_LABEL = 'Show password'

describe('LoginInput', () => {
  const defaultProps = {
    value: EMPTY_STRING,
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders a leading icon when startIcon is provided', () => {
      render(
        <LoginInput
          {...defaultProps}
          startIcon={<svg data-testid='leading-icon' />}
        />
      )

      expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
    })

    it('renders the placeholder on the input', () => {
      render(
        <LoginInput
          {...defaultProps}
          placeholder='User Name'
        />
      )

      expect(screen.getByPlaceholderText('User Name')).toBeInTheDocument()
    })

    it('renders the label when provided', () => {
      render(
        <LoginInput
          {...defaultProps}
          label='Tenant'
        />
      )

      expect(screen.getByText('Tenant')).toBeInTheDocument()
    })

    it('renders the error message when error is provided', () => {
      render(
        <LoginInput
          {...defaultProps}
          error='Invalid credentials'
        />
      )

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  describe('Password', () => {
    it('renders a password input and toggles visibility', () => {
      render(
        <LoginInput
          {...defaultProps}
          dataTestId='password'
          type='password'
        />
      )

      const input = screen.getByTestId('password')
      expect(input).toHaveAttribute('type', 'password')

      fireEvent.click(screen.getByRole('button', { name: SHOW_LABEL }))
      expect(input).toHaveAttribute('type', 'text')

      fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
      expect(input).toHaveAttribute('type', 'password')
    })

    it('does not render a visibility toggle for text inputs', () => {
      render(<LoginInput {...defaultProps} />)

      expect(
        screen.queryByRole('button', { name: SHOW_LABEL })
      ).not.toBeInTheDocument()
    })
  })

  describe('Disabled', () => {
    it('disables the input and the visibility toggle', () => {
      render(
        <LoginInput
          {...defaultProps}
          dataTestId='password'
          disabled
          type='password'
        />
      )

      expect(screen.getByTestId('password')).toBeDisabled()
      expect(screen.getByRole('button', { name: SHOW_LABEL })).toBeDisabled()
    })
  })

  describe('User interactions', () => {
    it('calls onChange with the input value when the user types', () => {
      const handleChange = vi.fn()
      render(
        <LoginInput
          {...defaultProps}
          dataTestId='field'
          onChange={handleChange}
        />
      )

      fireEvent.change(screen.getByTestId('field'), {
        target: { value: 'weka' }
      })

      expect(handleChange).toHaveBeenCalledWith('weka')
    })
  })
})

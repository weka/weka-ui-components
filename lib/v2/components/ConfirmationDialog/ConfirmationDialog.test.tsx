import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ConfirmationDialog } from './ConfirmationDialog'

const TITLE = 'Confirm Action'
const MESSAGE = 'Are you sure you want to proceed?'
const SUB_MESSAGE = 'This action cannot be undone.'
const PROCESSING_TEXT = 'Processing...'

describe('ConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    title: TITLE,
    message: MESSAGE,
    onConfirm: vi.fn(),
    onCancel: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  describe('Rendering', () => {
    it('renders nothing when open is false', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          open={false}
        />
      )
      expect(screen.queryByText(TITLE)).not.toBeInTheDocument()
    })

    it('renders title when open is true', () => {
      render(<ConfirmationDialog {...defaultProps} />)
      expect(screen.getByText(TITLE)).toBeInTheDocument()
    })

    it('renders message', () => {
      render(<ConfirmationDialog {...defaultProps} />)
      expect(screen.getByText(MESSAGE)).toBeInTheDocument()
    })

    it('renders subMessage when provided', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          subMessage={SUB_MESSAGE}
        />
      )
      expect(screen.getByText(SUB_MESSAGE)).toBeInTheDocument()
    })

    it('does not render subMessage when not provided', () => {
      render(<ConfirmationDialog {...defaultProps} />)
      expect(screen.queryByText(SUB_MESSAGE)).not.toBeInTheDocument()
    })

    it('renders default button text', () => {
      render(<ConfirmationDialog {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: 'Confirm' })
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('renders custom button text', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          cancelText='Keep'
          confirmText='Delete'
        />
      )
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
    })

    it('shows Processing... when isConfirming is true', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          isConfirming
        />
      )
      expect(
        screen.getByRole('button', { name: PROCESSING_TEXT })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Confirm' })
      ).not.toBeInTheDocument()
    })

    it('disables confirm button when isConfirming is true', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          isConfirming
        />
      )
      expect(
        screen.getByRole('button', { name: PROCESSING_TEXT })
      ).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('calls onConfirm when confirm button is clicked', () => {
      const handleConfirm = vi.fn()
      render(
        <ConfirmationDialog
          {...defaultProps}
          onConfirm={handleConfirm}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when cancel button is clicked', () => {
      const handleCancel = vi.fn()
      render(
        <ConfirmationDialog
          {...defaultProps}
          onCancel={handleCancel}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(handleCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when popup close button is clicked', () => {
      const handleCancel = vi.fn()
      render(
        <ConfirmationDialog
          {...defaultProps}
          onCancel={handleCancel}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(handleCancel).toHaveBeenCalledTimes(1)
    })

    it('does not call onConfirm when isConfirming is true', () => {
      const handleConfirm = vi.fn()
      render(
        <ConfirmationDialog
          {...defaultProps}
          isConfirming
          onConfirm={handleConfirm}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: PROCESSING_TEXT }))
      expect(handleConfirm).not.toHaveBeenCalled()
    })
  })

  describe('Button Variants', () => {
    it('applies danger style to confirm button by default', () => {
      render(<ConfirmationDialog {...defaultProps} />)
      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton.className).toContain('dangerButton')
    })

    it('applies primary style to confirm button when variant is primary', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          confirmButtonVariant='primary'
        />
      )
      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton.className).toContain('primaryButton')
    })
  })
})

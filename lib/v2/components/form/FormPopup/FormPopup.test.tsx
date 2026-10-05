import type { ReactNode } from 'react'

import { useForm } from 'react-hook-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, KEYBOARD_KEYS } from '#v2/utils/consts'

import { FORM_POPUP_DEFAULT_LABELS, FormPopup } from './FormPopup'

interface SimpleFormValues {
  name: string
}

interface FormPopupHostProps {
  readonly onSubmit?: (data: SimpleFormValues) => void
  readonly onClose?: () => void
  readonly extraActions?: ReactNode
  readonly open?: boolean
  readonly isSubmitting?: boolean
  readonly error?: string
  readonly submitText?: string
  readonly cancelText?: string
}

const DIALOG_TITLE = 'Test Dialog'
const VALIDATE_BUTTON = 'Validate'

function FormPopupHost({
  onSubmit = vi.fn(),
  onClose = vi.fn(),
  extraActions,
  open = true,
  isSubmitting,
  error,
  submitText,
  cancelText
}: FormPopupHostProps) {
  const form = useForm<SimpleFormValues>({
    defaultValues: { name: EMPTY_STRING }
  })

  return (
    <FormPopup
      cancelText={cancelText}
      error={error}
      extraActions={extraActions}
      form={form}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
      open={open}
      submitText={submitText}
      title={DIALOG_TITLE}
    >
      <div>form content</div>
    </FormPopup>
  )
}

describe('FormPopup', () => {
  it('renders the title', async () => {
    render(<FormPopupHost />)

    expect(await screen.findByText(DIALOG_TITLE)).toBeInTheDocument()
  })

  it('renders Cancel and Submit buttons with the default labels', async () => {
    render(<FormPopupHost />)

    expect(
      await screen.findByRole('button', {
        name: FORM_POPUP_DEFAULT_LABELS.CANCEL
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: FORM_POPUP_DEFAULT_LABELS.SUBMIT })
    ).toBeInTheDocument()
  })

  it('uses custom submit and cancel labels when provided', async () => {
    render(
      <FormPopupHost
        cancelText='Dismiss'
        submitText='Save'
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Dismiss' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('shows the submitting label and disables the buttons while submitting', async () => {
    render(<FormPopupHost isSubmitting />)

    const submittingButton = await screen.findByRole('button', {
      name: FORM_POPUP_DEFAULT_LABELS.SUBMITTING
    })

    expect(submittingButton).toBeDisabled()
    expect(
      screen.getByRole('button', { name: FORM_POPUP_DEFAULT_LABELS.CANCEL })
    ).toBeDisabled()
  })

  it('renders the error banner as an alert', async () => {
    render(<FormPopupHost error='Something failed' />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Something failed'
    )
  })

  it('renders children inside the form', async () => {
    render(<FormPopupHost />)

    expect(await screen.findByText('form content')).toBeInTheDocument()
  })

  it('renders extraActions alongside Cancel and Submit', async () => {
    render(
      <FormPopupHost
        extraActions={<button type='button'>{VALIDATE_BUTTON}</button>}
      />
    )

    await screen.findByText(DIALOG_TITLE)

    expect(
      screen.getByRole('button', { name: VALIDATE_BUTTON })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: FORM_POPUP_DEFAULT_LABELS.CANCEL })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: FORM_POPUP_DEFAULT_LABELS.SUBMIT })
    ).toBeInTheDocument()
  })

  it('does not render extraActions when not provided', async () => {
    render(<FormPopupHost />)

    await screen.findByText(DIALOG_TITLE)

    expect(
      screen.queryByRole('button', { name: VALIDATE_BUTTON })
    ).not.toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<FormPopupHost onClose={onClose} />)

    fireEvent.click(
      await screen.findByRole('button', {
        name: FORM_POPUP_DEFAULT_LABELS.CANCEL
      })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('submits the form values when Submit is clicked', async () => {
    const onSubmit = vi.fn()
    render(<FormPopupHost onSubmit={onSubmit} />)

    fireEvent.click(
      await screen.findByRole('button', {
        name: FORM_POPUP_DEFAULT_LABELS.SUBMIT
      })
    )

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: EMPTY_STRING })
  })

  it('ignores Escape while submitting', async () => {
    const onClose = vi.fn()
    render(
      <FormPopupHost
        isSubmitting
        onClose={onClose}
      />
    )
    await screen.findByText(DIALOG_TITLE)

    fireEvent.keyDown(document, { key: KEYBOARD_KEYS.ESCAPE })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('ignores the header close button while submitting', async () => {
    const onClose = vi.fn()
    render(
      <FormPopupHost
        isSubmitting
        onClose={onClose}
      />
    )

    fireEvent.click(await screen.findByRole('button', { name: 'Close' }))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes on Escape and on the header close button when idle', async () => {
    const onClose = vi.fn()
    render(<FormPopupHost onClose={onClose} />)

    fireEvent.keyDown(document, { key: KEYBOARD_KEYS.ESCAPE })
    fireEvent.click(await screen.findByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})

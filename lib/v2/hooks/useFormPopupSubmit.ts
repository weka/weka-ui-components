import type { FieldValues } from 'react-hook-form'

import { useCallback, useState } from 'react'

import { getFormErrorMessage } from '#v2/utils/formErrorUtils'
import { toastSuccess } from '#v2/utils/toast'

export interface UseFormPopupSubmitOptions {
  /** Translated fallback shown when the caught error carries no readable message. */
  errorFallbackMessage: string
  /**
   * Translated success toast shown once `submitFn` resolves. Omit when
   * `submitFn` already reports success itself (e.g. a message that varies by
   * branch, or a dialog with no success toast at all).
   */
  successMessage?: string
  /** Runs after the success toast, before `onClose`. */
  onSuccess?: () => Promise<unknown> | unknown
  /**
   * Closes the popup after a successful submit. Omit to keep the popup open,
   * or when `submitFn` closes it itself.
   */
  onClose?: () => void
  /**
   * Called with the resolved error message instead of the returned `error`
   * state — use it to show the error as a toast (`toastError`)
   * rather than through FormPopup's inline `error` banner.
   */
  onError?: (message: string) => void
}

export interface UseFormPopupSubmitResult<
  TFieldValues extends FieldValues = FieldValues
> {
  isSubmitting: boolean
  /** Resolved error message from the last failed submit, for FormPopup's `error` prop. Always undefined when `onError` is supplied. */
  error: string | undefined
  submit: (values: TFieldValues) => Promise<void>
  /** Clears `error` outside a submit — e.g. when a dialog resets its form on reopen. */
  resetError: () => void
}

/**
 * Wraps a FormPopup submit handler with the shared isSubmitting/error/toast/
 * close lifecycle that most dialogs repeat by hand: set isSubmitting, clear
 * the previous error, await `submitFn`, then report success or resolve the
 * caught error via `getFormErrorMessage`.
 *
 * `submitFn` may still own branch-specific behavior a dialog needs beyond
 * this lifecycle — its own success toast(s), a mid-flow API call, closing the
 * popup itself. To surface a specific error message instead of the resolved
 * fallback (a parsed-error remap, a duplicate-entry check that must abort
 * without an API call), throw `new Error(message)` from `submitFn`:
 * `getFormErrorMessage` reads `.message` off any thrown object before
 * falling back, so the thrown message passes through unchanged.
 */
export function useFormPopupSubmit<
  TFieldValues extends FieldValues = FieldValues
>(
  submitFn: (values: TFieldValues) => Promise<void>,
  options: UseFormPopupSubmitOptions
): UseFormPopupSubmitResult<TFieldValues> {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>()
  const { errorFallbackMessage, successMessage, onSuccess, onClose, onError } =
    options

  const submit = useCallback(
    async (values: TFieldValues) => {
      setIsSubmitting(true)
      setSubmitError(undefined)
      try {
        await submitFn(values)
        if (successMessage) {
          toastSuccess(successMessage)
        }
        if (onSuccess) {
          await onSuccess()
        }
        onClose?.()
      } catch (error) {
        const message = getFormErrorMessage(error, errorFallbackMessage)
        if (onError) {
          onError(message)
        } else {
          setSubmitError(message)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      submitFn,
      successMessage,
      onSuccess,
      onClose,
      onError,
      errorFallbackMessage
    ]
  )

  const resetError = useCallback(() => {
    setSubmitError(undefined)
  }, [])

  return { isSubmitting, submit, resetError, error: submitError }
}

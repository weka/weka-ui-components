import type { FormEvent, ReactNode } from 'react'
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

import { useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import clsx from 'clsx'

import { NOOP } from '#v2/utils/consts'

import { WarningCircleIcon } from '../../../icons'
import { Button } from '../../Button'
import { Popup } from '../../Popup'

import styles from './formPopup.module.scss'

const ERROR_ICON_SIZE = 14

export const FORM_POPUP_DEFAULT_LABELS = {
  SUBMIT: 'Submit',
  SUBMITTING: 'Submitting…',
  CANCEL: 'Cancel'
} as const

export interface FormPopupProps<
  TFieldValues extends FieldValues = FieldValues
> {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: SubmitHandler<TFieldValues>
  form: UseFormReturn<TFieldValues>
  submitText?: string
  submittingText?: string
  cancelText?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
  error?: string
  children: ReactNode
  width?: number | string
  height?: number | string
  extraActions?: ReactNode
}

export function FormPopup<TFieldValues extends FieldValues = FieldValues>({
  open,
  title,
  onClose,
  onSubmit,
  form,
  submitText = FORM_POPUP_DEFAULT_LABELS.SUBMIT,
  submittingText = FORM_POPUP_DEFAULT_LABELS.SUBMITTING,
  cancelText = FORM_POPUP_DEFAULT_LABELS.CANCEL,
  isSubmitting = false,
  submitDisabled = false,
  error,
  children,
  width,
  height,
  extraActions
}: Readonly<FormPopupProps<TFieldValues>>) {
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      void form.handleSubmit(onSubmit)(e)
    },
    [form, onSubmit]
  )

  return (
    <Popup
      closeOnOverlayClick={false}
      contentOverflow='visible'
      height={height}
      onClose={isSubmitting ? NOOP : onClose}
      open={open}
      title={title}
      width={width}
    >
      <FormProvider {...form}>
        <form
          className={clsx(styles.form, height && styles.formFullHeight)}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className={styles.body}>
            <div className={styles.bodyInner}>{children}</div>
          </div>
          {error ? (
            <div
              className={styles.errorBanner}
              role='alert'
            >
              <span className={styles.errorBannerIcon}>
                <WarningCircleIcon
                  filled
                  size={ERROR_ICON_SIZE}
                />
              </span>
              {error}
            </div>
          ) : null}
          <div className={styles.actions}>
            {extraActions ? (
              <div className={styles.actionsLeft}>{extraActions}</div>
            ) : null}
            <div className={styles.actionsRight}>
              <Button
                disabled={isSubmitting}
                onClick={onClose}
                type='button'
                variant='secondary'
              >
                {cancelText}
              </Button>
              <Button
                disabled={isSubmitting || submitDisabled}
                type='submit'
                variant='primary'
              >
                {isSubmitting ? submittingText : submitText}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Popup>
  )
}

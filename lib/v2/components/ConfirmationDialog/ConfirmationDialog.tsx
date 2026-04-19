import { BUTTON_VARIANTS } from '../Button'
import { Button } from '../Button'
import { Popup } from '../Popup'

import styles from './confirmationDialog.module.scss'

export const CONFIRM_BUTTON_VARIANTS = {
  DANGER: 'danger',
  PRIMARY: 'primary'
} as const

export type ConfirmButtonVariant =
  (typeof CONFIRM_BUTTON_VARIANTS)[keyof typeof CONFIRM_BUTTON_VARIANTS]

export interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  subMessage?: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  isConfirming?: boolean
  confirmButtonVariant?: ConfirmButtonVariant
}

export function ConfirmationDialog({
  open,
  title,
  message,
  subMessage,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
  confirmButtonVariant = CONFIRM_BUTTON_VARIANTS.DANGER
}: Readonly<ConfirmationDialogProps>) {
  return (
    <Popup
      dataTestId='confirmation-dialog'
      onClose={onCancel}
      open={open}
      title={title}
      actions={
        <div className={styles.actions}>
          <Button
            onClick={onCancel}
            variant={BUTTON_VARIANTS.SECONDARY}
          >
            {cancelText}
          </Button>
          <Button
            disabled={isConfirming}
            onClick={onConfirm}
            variant={BUTTON_VARIANTS.SECONDARY}
            extraClass={
              confirmButtonVariant === CONFIRM_BUTTON_VARIANTS.DANGER
                ? styles.dangerButton
                : styles.primaryButton
            }
          >
            {isConfirming ? 'Processing...' : confirmText}
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {subMessage ? <p className={styles.subMessage}>{subMessage}</p> : null}
      </div>
    </Popup>
  )
}

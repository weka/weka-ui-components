import type { Dispatch, ReactNode, SetStateAction } from 'react'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import clsx from 'clsx'

import Button from '../components/Button'

import './dialogContext.scss'

const DialogContext = createContext<DialogContextType | null>(null)

export interface Dialog {
  title: ReactNode
  body: ReactNode
  type?: 'info' | 'success' | 'error'
  cancelText?: string
  confirmText?: string
  onConfirm?: () => Promise<void>
  onCancel?: () => void
  shouldConfirmBtnLoading?: boolean
}

interface DialogProps {
  dialog: Dialog
  unSetDialog: () => void
}

interface DialogProviderProps {
  children: ReactNode
  [key: string]: unknown
}

interface DialogContextType {
  setDialog: Dispatch<SetStateAction<Dialog | null | undefined>>
  unSetDialog: () => void
}

function Dialog({ dialog, unSetDialog }: DialogProps) {
  const [isClickLoading, setIsClickLoading] = useState(false)

  return (
    <div>
      <MuiDialog
        classes={{ paper: 'dialog' }}
        open={!!dialog}
      >
        <DialogTitle>
          <div
            data-testid='dialog_title'
            className={clsx('headline', {
              success: dialog.type === 'success',
              error: dialog.type === 'error'
            })}
          >
            {dialog.title}
          </div>
        </DialogTitle>
        <DialogContent classes={{ root: 'dialogContent' }}>
          {dialog.body}
        </DialogContent>
        <DialogActions classes={{ root: 'dialogActions' }}>
          <Button
            data-testid='close_button'
            empty={!!dialog.onConfirm}
            onClick={() => {
              dialog?.onCancel?.()
              unSetDialog()
            }}
          >
            {dialog.cancelText ?? (dialog.onConfirm ? 'Cancel' : 'Close')}
          </Button>
          {!!dialog.onConfirm && (
            <Button
              data-testid='confirm_button'
              isLoading={isClickLoading}
              onClick={() => {
                if (dialog.shouldConfirmBtnLoading) {
                  setIsClickLoading(true)
                  dialog.onConfirm?.().finally(() => {
                    setIsClickLoading(false)
                    unSetDialog()
                  })
                } else {
                  dialog.onConfirm?.()
                  unSetDialog()
                }
              }}
            >
              {dialog.confirmText || 'Confirm'}
            </Button>
          )}
        </DialogActions>
      </MuiDialog>
    </div>
  )
}

function DialogProvider(props: DialogProviderProps) {
  const [dialog, setDialog] = useState<Dialog | null>()
  const unSetDialog = useCallback(() => {
    setDialog(null)
  }, [])

  const contextValue = useMemo(
    () => ({ unSetDialog, setDialog }),
    [unSetDialog]
  )

  return (
    <DialogContext.Provider
      value={contextValue}
      {...props}
    >
      {props.children}
      {dialog ? (
        <Dialog
          dialog={dialog}
          unSetDialog={unSetDialog}
        />
      ) : null}
    </DialogContext.Provider>
  )
}

const useDialog = () => {
  const context = useContext(DialogContext)
  if (context === undefined || context === null) {
    throw new Error('useDialog must be used within a DialogProvider')
  }

  return context
}

export { DialogProvider, useDialog }

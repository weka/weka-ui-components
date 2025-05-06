import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import Button from '../components/Button'
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import clsx from 'clsx'

import './dialogContext.scss'

const DialogContext = createContext<DialogContextType | null>(null)

export interface Dialog {
  title: ReactNode
  body: ReactNode
  type?: 'info' | 'success' | 'error'
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  onCancel?: () => void
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

const Dialog = ({ dialog, unSetDialog }: DialogProps) => {
  return (
    <div>
      <MuiDialog open={!!dialog} classes={{ paper: 'dialog' }}>
        <DialogTitle>
          <div
            className={clsx('headline', {
              success: dialog.type === 'success',
              error: dialog.type === 'error'
            })}
            data-testid='dialog_title'
          >
            {dialog.title}
          </div>
        </DialogTitle>
        <DialogContent classes={{ root: 'dialogContent' }}>
          {dialog.body}
        </DialogContent>
        <DialogActions classes={{ root: 'dialogActions' }}>
          <Button
            onClick={() => {
              dialog?.onCancel?.()
              unSetDialog()
            }}
            empty={!!dialog.onConfirm}
            data-testid='close_button'
          >
            {dialog.cancelText ?? (dialog.onConfirm ? 'Cancel' : 'Close')}
          </Button>
          {!!dialog.onConfirm && (
            <Button
              onClick={() => {
                dialog.onConfirm?.()
                unSetDialog()
              }}
              data-testid='confirm_button'
            >
              {dialog.confirmText || 'Confirm'}
            </Button>
          )}
        </DialogActions>
      </MuiDialog>
    </div>
  )
}

const DialogProvider = (props: DialogProviderProps) => {
  const [dialog, setDialog] = useState<Dialog | null>()
  const unSetDialog = useCallback(() => {
    setDialog(null)
  }, [])

  const contextValue = useMemo(
    () => ({ unSetDialog, setDialog }),
    [unSetDialog]
  )

  return (
    <DialogContext.Provider value={contextValue} {...props}>
      {props.children}
      {dialog && <Dialog dialog={dialog} unSetDialog={unSetDialog} />}
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

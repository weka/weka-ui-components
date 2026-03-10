import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import utils from 'utils'

import Button from '../Button'
import Info from '../Info'
import Loader from '../Loader'

import './formWrapperDialog.scss'

export interface FormDialogProps {
  isOpen: boolean
  toggleOpen: () => void
  onCancel?: () => void
  title: string
  info?: string
  submitText?: string
  cancelText?: string
  dialogClass?: string
  children: React.ReactNode
  handleSubmit?: () => Promise<void>
  handleValidate?: () => Promise<void>
  showCancel?: boolean
  disabled?: boolean
  isLoading?: boolean
  showSubmit?: boolean
}

function FormWrapperDialog({
  isOpen,
  toggleOpen,
  onCancel,
  title = EMPTY_STRING,
  info = EMPTY_STRING,
  children,
  handleSubmit,
  handleValidate = null,
  submitText = EMPTY_STRING,
  dialogClass,
  cancelText = EMPTY_STRING,
  disabled = false,
  showCancel = true,
  showSubmit = true,
  isLoading = false
}: FormDialogProps) {
  const [isClickLoading, setClickLoading] = useState(false)
  const [isValidateClickLoading, setValidateClickLoading] = useState(false)

  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const handleCancel = () => {
    toggleOpen()
    onCancel?.()
  }

  return (
    isOpen && (
      <MuiDialog
        onClose={(_, reason) => utils.closeDialogOnEscape(reason, toggleOpen)}
        open={isOpen}
        classes={{
          paper: clsx('dialog-wrapper', 'form-wrapper-dialog', dialogClass)
        }}
      >
        <DialogTitle classes={{ root: 'dialog-title' }}>
          <div className='dialog-headline heading-2'>
            {title}
            {!!info && <Info data={info} />}
          </div>
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            if (!handleSubmit) {
              return
            }

            setClickLoading(true)
            handleSubmit().finally(() => {
              if (mounted.current) {
                setClickLoading(false)
              }
            })
          }}
        >
          <DialogContent classes={{ root: 'dialog-content' }}>
            {isLoading ? <Loader /> : children}
          </DialogContent>
          <DialogActions classes={{ root: 'dialog-actions general-actions' }}>
            {showCancel ? (
              <Button
                empty={showSubmit}
                onClick={handleCancel}
              >
                {cancelText || 'Cancel'}
              </Button>
            ) : null}
            {handleValidate ? (
              <Button
                empty
                isLoading={isValidateClickLoading}
                onClick={() => {
                  setValidateClickLoading(true)
                  handleValidate().finally(() => {
                    if (mounted.current) {
                      setValidateClickLoading(false)
                    }
                  })
                }}
              >
                Validate
              </Button>
            ) : null}
            {showSubmit ? (
              <Button
                disable={isLoading || disabled}
                isLoading={isClickLoading}
                type='submit'
              >
                {submitText || 'Save'}
              </Button>
            ) : null}
          </DialogActions>
        </form>
      </MuiDialog>
    )
  )
}

export default FormWrapperDialog

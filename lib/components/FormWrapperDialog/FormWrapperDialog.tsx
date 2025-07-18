import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import Button from '../Button'
import Loader from '../Loader'
import Info from '../Info'
import clsx from 'clsx'
import { EMPTY_STRING } from 'consts'
import utils from 'utils'

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

function FormWrapperDialog(props: FormDialogProps) {
  const [isClickLoading, setClickLoading] = useState(false)
  const [isValidateClickLoading, setValidateClickLoading] = useState(false)
  const {
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
  } = props

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
        open={isOpen}
        onClose={(_, reason) => utils.closeDialogOnEscape(reason, toggleOpen)}
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
            {showCancel && (
              <Button empty={showSubmit} onClick={handleCancel}>
                {cancelText || 'Cancel'}
              </Button>
            )}
            {handleValidate && (
              <Button
                empty
                onClick={() => {
                  setValidateClickLoading(true)
                  handleValidate().finally(() => {
                    if (mounted.current) {
                      setValidateClickLoading(false)
                    }
                  })
                }}
                isLoading={isValidateClickLoading}
              >
                Validate
              </Button>
            )}
            {showSubmit && (
              <Button
                type='submit'
                disable={isLoading || disabled}
                isLoading={isClickLoading}
              >
                {submitText || 'Save'}
              </Button>
            )}
          </DialogActions>
        </form>
      </MuiDialog>
    )
  )
}

export default FormWrapperDialog

import React, { useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { DIALOG_STATUSES, TOASTER_DIALOG, TOASTER_DIALOG_DISMISS } from 'consts'
import Utils from 'utils'
import svgs from 'svgs'
import { useDialog } from '../../context'

import './toasterDialog.scss'

const { Approve, Warning } = svgs

export type DialogStatus =
  (typeof DIALOG_STATUSES)[keyof typeof DIALOG_STATUSES]

interface ToasterMessage {
  status: DialogStatus
  message: string
}

const isToasterDialogEvent = (
  event: Event
): event is CustomEvent<ToasterMessage> =>
  'detail' in event &&
  Utils.isObject(event.detail) &&
  'status' in event.detail &&
  'message' in event.detail &&
  typeof event.detail.message === 'string'

function ToasterDialog() {
  const { setDialog } = useDialog()
  const queueRef = useRef<ToasterMessage[]>([])
  const isShowingRef = useRef(false)

  const showNextMessage = useCallback(() => {
    if (queueRef.current.length === 0) {
      isShowingRef.current = false
      return
    }

    isShowingRef.current = true
    const { status, message } = queueRef.current[0]

    setDialog({
      title: (
        <div
          className={clsx({
            isToasterDialogSuccess: status === DIALOG_STATUSES.SUCCESS,
            isToasterDialogError: status === DIALOG_STATUSES.ERROR
          })}
        >
          {status === DIALOG_STATUSES.SUCCESS ? <Approve /> : <Warning />}
          {Utils.capitalize(status)}
        </div>
      ),
      body: message,
      type: status,
      onCancel: () => {
        queueRef.current.shift()
        setTimeout(showNextMessage, 0)
      }
    })
  }, [setDialog])

  useEffect(() => {
    function handleToasterDialog(event: Event) {
      if (!isToasterDialogEvent(event)) {
        throw new Error('Incorrect toaster dialog event!')
      }

      const { status, message } = event.detail

      const isDuplicate = queueRef.current.some(
        (item) => item.status === status && item.message === message
      )

      if (!isDuplicate) {
        queueRef.current.push(event.detail)
      }

      if (!isShowingRef.current) {
        showNextMessage()
      }
    }

    function dismissToasterDialog() {
      queueRef.current.shift()
      if (queueRef.current.length > 0) {
        showNextMessage()
      } else {
        isShowingRef.current = false
        setDialog(null)
      }
    }

    document.addEventListener(TOASTER_DIALOG, handleToasterDialog)
    document.addEventListener(TOASTER_DIALOG_DISMISS, dismissToasterDialog)

    return () => {
      document.removeEventListener(TOASTER_DIALOG, handleToasterDialog)
      document.removeEventListener(TOASTER_DIALOG_DISMISS, dismissToasterDialog)
    }
  }, [setDialog, showNextMessage])

  return null
}

export default ToasterDialog

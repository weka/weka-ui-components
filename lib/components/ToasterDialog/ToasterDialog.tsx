import React, { useEffect } from 'react'
import clsx from 'clsx'
import { DIALOG_STATUSES, TOASTER_DIALOG, TOASTER_DIALOG_DISMISS } from 'consts'
import Utils from 'utils'
import svgs from 'svgs'
import { useDialog } from '../../context'

import './toasterDialog.scss'

const { Approve, Warning } = svgs

export type DialogStatus =
  (typeof DIALOG_STATUSES)[keyof typeof DIALOG_STATUSES]

const isToasterDialogEvent = (
  event: Event
): event is CustomEvent<{ status: DialogStatus; message: string }> =>
  'detail' in event &&
  Utils.isObject(event.detail) &&
  'status' in event.detail &&
  'message' in event.detail &&
  typeof event.detail.message === 'string'

function ToasterDialog() {
  const { setDialog } = useDialog()

  useEffect(() => {
    function setToasterDialog(event: Event) {
      if (!isToasterDialogEvent(event)) {
        throw new Error('Incorrect toaster dialog event!')
      }

      const { status, message } = event.detail

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
        type: status
      })
    }

    function dismissToasterDialog() {
      setDialog(null)
    }

    document.addEventListener(TOASTER_DIALOG, setToasterDialog)
    document.addEventListener(TOASTER_DIALOG_DISMISS, dismissToasterDialog)

    return () => {
      document.removeEventListener(TOASTER_DIALOG, setToasterDialog)
      document.removeEventListener(TOASTER_DIALOG_DISMISS, dismissToasterDialog)
    }
  }, [])

  return null
}

export default ToasterDialog

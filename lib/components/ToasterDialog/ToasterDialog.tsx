import React, { useEffect } from 'react'
import clsx from 'clsx'
import { DIALOG_STATUSES, TOASTER_DIALOG } from '~consts'
import { useDialog } from '~context'
import Utils from '~utils'
import { Approve, Warning } from '~svgs'

import './toasterDialog.scss'

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

    document.addEventListener(TOASTER_DIALOG, setToasterDialog)
    return () => {
      document.removeEventListener(TOASTER_DIALOG, setToasterDialog)
    }
  }, [])

  return null
}

export default ToasterDialog

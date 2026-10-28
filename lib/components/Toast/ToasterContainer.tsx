import React from 'react'
import { ToastContainer } from 'react-toastify'

import CloseButton from '../CloseButton'

function ToasterContainer() {
  return (
    <ToastContainer
      // react-toastify 10 turned these off by default; keep the v9 behavior
      closeOnClick
      draggable
      closeButton={<CloseButton />}
      limit={3}
    />
  )
}

export default ToasterContainer

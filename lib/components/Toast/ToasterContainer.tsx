import { ToastContainer } from 'react-toastify'
import CloseButton from '../CloseButton'
import React from 'react'

const ToasterContainer = () => (
  <ToastContainer closeButton={<CloseButton />} limit={3} />
)

export default ToasterContainer

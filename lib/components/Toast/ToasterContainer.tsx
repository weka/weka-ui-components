import { ToastContainer } from 'react-toastify'
import CloseButton from '../CloseButton'
import React from 'react'
import 'react-toastify/dist/ReactToastify.css'

const ToasterContainer = () => (
  <ToastContainer closeButton={<CloseButton />} limit={3} />
)

export default ToasterContainer

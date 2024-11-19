import React from 'react'
import { IconButton } from '@mui/material'
import { ThinClose } from '~svgs'

import './closeButton.scss'

function CloseButton() {
  return (
    <IconButton className='Toastify__close-button'>
      <ThinClose />
    </IconButton>
  )
}

export default CloseButton

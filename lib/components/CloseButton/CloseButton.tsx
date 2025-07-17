import React from 'react'
import { IconButton } from '@mui/material'
import svgs from 'svgs'

import './closeButton.scss'

const { ThinClose } = svgs

function CloseButton() {
  return (
    <IconButton className='Toastify__close-button'>
      <ThinClose />
    </IconButton>
  )
}

export default CloseButton

import React from 'react'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import { Arrow } from '../../svgs'

import './showMore.scss'

function ShowMore(props) {
  const { isClose, onClick } = props
  const showClasses = clsx({ close: isClose })
  return (
    <IconButton onClick={onClick} className='show-more-wrapper'>
      <Arrow className={showClasses} />
    </IconButton>
  )
}

export default ShowMore

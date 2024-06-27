import React from 'react'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import Tooltip from '../Tooltip'
import { Arrow } from '../../svgs'

import './showMore.scss'

function ShowMore(props: {
  isClose: boolean
  onClick: () => void
  extraClass?: string
  disabled?: boolean
  tooltip?: string
}) {
  const { isClose, onClick, extraClass, disabled, tooltip } = props
  const showClasses = clsx({ close: isClose })
  return (
    <Tooltip data={tooltip}>
      <div>
        <IconButton
          onClick={onClick}
          className={clsx('show-more-wrapper', extraClass)}
          disabled={!!disabled}
        >
          <Arrow className={showClasses} />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default ShowMore

import React from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import svgs from 'svgs'

import Tooltip from '../Tooltip'

import './showMore.scss'

const { Arrow } = svgs

function ShowMore({
  isClose,
  onClick,
  extraClass,
  disabled,
  tooltip
}: {
  isClose: boolean
  onClick: () => void
  extraClass?: string
  disabled?: boolean
  tooltip?: string
}) {
  const showClasses = clsx({ close: isClose })
  return (
    <Tooltip data={tooltip}>
      <div>
        <IconButton
          className={clsx('show-more-wrapper', extraClass)}
          disabled={!!disabled}
          onClick={onClick}
        >
          <Arrow className={showClasses} />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default ShowMore

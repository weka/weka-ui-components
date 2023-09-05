import { IconButton } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import Tooltip from '../Tooltip'
import { ThinArrow } from '../../svgs'

import './expandCollapseButton.scss'

interface ExpandCollapseButtonProps {
  onChange: (shouldCollapse: boolean) => void
  shouldCollapse: boolean
  disabled?: boolean
}

function ExpandCollapseButton(props: ExpandCollapseButtonProps) {
  const { onChange, shouldCollapse, disabled } = props

  return (
    <Tooltip
      data={disabled ? '' : shouldCollapse ? 'Expand All' : 'Collapse All'}
    >
      <div>
        <IconButton
          disabled={disabled}
          className={clsx({
            ['text-editor-expand-collapse-btn']: true,
            ['rotate']: !shouldCollapse
          })}
          onClick={() => onChange(!shouldCollapse)}
        >
          <ThinArrow />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default ExpandCollapseButton

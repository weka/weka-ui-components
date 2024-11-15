import { IconButton } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import Tooltip from '../Tooltip'
import { ThinArrow } from 'svgs'
import { EMPTY_STRING } from 'consts'

import './expandCollapseButton.scss'

interface ExpandCollapseButtonProps {
  onChange: (shouldCollapse: boolean) => void
  shouldCollapse: boolean
  disabled?: boolean
  tooltip?: string
}

function ExpandCollapseButton(props: ExpandCollapseButtonProps) {
  const { onChange, shouldCollapse, disabled, tooltip } = props

  return (
    <Tooltip
      data={
        tooltip ||
        (disabled
          ? EMPTY_STRING
          : shouldCollapse
          ? 'Expand All'
          : 'Collapse All')
      }
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

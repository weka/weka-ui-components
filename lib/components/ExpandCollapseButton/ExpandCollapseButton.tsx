import React from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import svgs from 'svgs'

import Tooltip from '../Tooltip'

import './expandCollapseButton.scss'

const { ThinArrow } = svgs

interface ExpandCollapseButtonProps {
  onChange: (shouldCollapse: boolean) => void
  shouldCollapse: boolean
  disabled?: boolean
  tooltip?: string
}

function ExpandCollapseButton({
  onChange,
  shouldCollapse,
  disabled,
  tooltip
}: ExpandCollapseButtonProps) {
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
          onClick={() => onChange(!shouldCollapse)}
          className={clsx({
            ['text-editor-expand-collapse-btn']: true,
            ['rotate']: !shouldCollapse
          })}
        >
          <ThinArrow />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default ExpandCollapseButton

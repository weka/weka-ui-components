import React from 'react'
import { CustomRowAction, ExtendedRow } from '../../Table'
import Tooltip from '../../../Tooltip'
import { IconButton } from '@mui/material'
import { EMPTY_STRING } from '../../../../consts'
import clsx from 'clsx'

import './iconButtonCell.scss'

interface IconButtonCellProps {
  action: CustomRowAction
  row: ExtendedRow<object>
}

function IconButtonCell({ row, action }: IconButtonCellProps) {
  const {
    Icon,
    onClick,
    tooltipText,
    disabled,
    extraClass = EMPTY_STRING
  } = action
  const iconBtnClasses = clsx({
    'icon-cell-btn': true,
    [extraClass]: true
  })

  return (
    <Tooltip
      data={
        (tooltipText instanceof Function
          ? tooltipText(row.original)
          : tooltipText) || EMPTY_STRING
      }
    >
      <div>
        <IconButton
          onClick={() => onClick({ ...row.original, ...row.state })}
          disabled={
            disabled instanceof Function ? disabled(row.original) : disabled
          }
          className={iconBtnClasses}
        >
          <Icon />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default IconButtonCell

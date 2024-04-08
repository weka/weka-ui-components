import React from 'react'
import Tooltip from '../../../../Tooltip'
import { IconButton } from '@mui/material'
import { EMPTY_STRING } from '../../../../../consts'
import clsx from 'clsx'
import { ExtendedCellProps } from '../../../types'

import './iconButtonCell.scss'

export interface IconButtonCellOptions<Data> {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  disabled?: boolean | ((rowValues: Data) => boolean)
  onClick: ((rowValues: Data) => void) | (() => void)
  tooltipText?: string | ((rowValues: Data) => string)
  extraClass?: string
}

export type IconButtonCellValue = never

export const IconButtonCellName = 'IconButtonCell'

function IconButtonCell<Data>(
  props: ExtendedCellProps<Data, IconButtonCellValue>
) {
  const { row, column } = props

  const cellDef = column.columnDef.meta?.cell
  if (!cellDef || cellDef.type !== IconButtonCellName) {
    throw new Error(
      `${IconButtonCellName}: cell options are missing or the type is incorrect`
    )
  }

  const {
    Icon,
    onClick,
    tooltipText,
    disabled,
    extraClass = EMPTY_STRING
  } = cellDef.options

  const iconBtnClasses = clsx({
    'icon-cell-btn': true,
    [extraClass]: true
  })

  return (
    <Tooltip
      data={
        (tooltipText instanceof Function
          ? tooltipText(row.original)
          : tooltipText) ?? EMPTY_STRING
      }
    >
      <div>
        <IconButton
          onClick={() => onClick(row.original)}
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

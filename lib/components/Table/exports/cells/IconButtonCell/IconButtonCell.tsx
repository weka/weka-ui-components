import React from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'

import Tooltip from '../../../../Tooltip'
import type { ExtendedCellProps } from '../../../types'

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

function IconButtonCell<Data>({
  row,
  column
}: ExtendedCellProps<Data, IconButtonCellValue>) {
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
          className={iconBtnClasses}
          onClick={() => onClick(row.original)}
          disabled={
            disabled instanceof Function ? disabled(row.original) : disabled
          }
        >
          <Icon />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default IconButtonCell

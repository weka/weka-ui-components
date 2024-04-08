import React, { SyntheticEvent } from 'react'
import Switch from '../../../../Switch'
import Tooltip from '../../../../Tooltip'
import { EMPTY_STRING } from '../../../../../consts'

import './switchCell.scss'
import { ExtendedCellProps, ExtendedRow } from '../../../types'

export interface SwitchCellOptions<Data> {
  onChange: (row: ExtendedRow<Data>) => void
  tooltipText?: string | ((value: boolean) => string)
}

export type SwitchCellValue = boolean

export const SwitchCellName = 'SwitchCell'

function SwitchCell<Data>(props: ExtendedCellProps<Data, SwitchCellValue>) {
  const { cell, column, row, customValue } = props

  const cellDef = column.columnDef.meta?.cell
  if (!cellDef || cellDef.type !== SwitchCellName) {
    throw new Error(
      `${SwitchCellName}: cell options are missing or the type is incorrect`
    )
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const { onChange, tooltipText = EMPTY_STRING } = cellDef.options
  const tooltip =
    tooltipText instanceof Function ? tooltipText(value) : tooltipText

  return (
    <Tooltip data={tooltip}>
      <div className='switch-cell'>
        <Switch
          onClick={(e: SyntheticEvent) => e.stopPropagation()}
          checked={value}
          onChange={() => onChange(row)}
        />
      </div>
    </Tooltip>
  )
}

export default SwitchCell

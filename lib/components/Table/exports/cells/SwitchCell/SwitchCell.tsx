import type { SyntheticEvent } from 'react'
import React from 'react'

import { EMPTY_STRING } from 'consts'

import Switch from '../../../../Switch'
import Tooltip from '../../../../Tooltip'
import type { ExtendedCellProps, ExtendedRow } from '../../../types'

import './switchCell.scss'

export interface SwitchCellOptions<Data> {
  onChange: (row: ExtendedRow<Data>) => void
  tooltipText?: string | ((value: boolean) => string)
}

export type SwitchCellValue = boolean

export const SwitchCellName = 'SwitchCell'

function SwitchCell<Data>({
  cell,
  column,
  row,
  customValue
}: ExtendedCellProps<Data, SwitchCellValue>) {
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
          checked={value}
          onChange={() => onChange(row)}
          onClick={(e: SyntheticEvent) => e.stopPropagation()}
        />
      </div>
    </Tooltip>
  )
}

export default SwitchCell

import React, { SyntheticEvent } from 'react'
import { CustomCellProps, ExtendedRow } from '../../Table'
import { ColumnInstance } from 'react-table'
import Switch from '../../../Switch'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'

import './switchCell.scss'

interface ExtendedColumn extends ColumnInstance {
  onChange: (row: ExtendedRow<object>) => void
  tooltipText?: string | ((value: boolean) => string)
}

interface ExtendedCustomCellProps<Data extends Record<string, unknown>>
  extends CustomCellProps<Data> {
  row: ExtendedRow<object>
}

function SwitchCell<Data extends Record<string, unknown>>({
  cell,
  column,
  row
}: ExtendedCustomCellProps<Data>) {
  const { value } = cell

  const { onChange, tooltipText = EMPTY_STRING } =
    column as unknown as ExtendedColumn
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

import React from 'react'
import { ColumnInstance } from 'react-table'
import { CustomCellProps } from '../../Table'
import clsx from 'clsx'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'

import './encryptedCell.scss'

interface ExtendedColumn extends ColumnInstance {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  extraClass?: string | ((value: any) => string)
  tooltipText?: string | ((value: any) => string)
}

function IconCell({ cell }: CustomCellProps) {
  const { value, column, row } = cell
  const {
    Icon,
    extraClass = EMPTY_STRING,
    tooltipText = EMPTY_STRING
  } = column as ExtendedColumn
  const additionalClass =
    extraClass instanceof Function ? extraClass(row.original) : extraClass
  const dataForTooltip =
    tooltipText instanceof Function ? tooltipText(row.original) : tooltipText

  return (
    <Tooltip data={dataForTooltip}>
      <div className={clsx('icon-cell', additionalClass)}>
        {value && <Icon />}
      </div>
    </Tooltip>
  )
}

export default IconCell

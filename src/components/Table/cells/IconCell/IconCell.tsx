import React from 'react'
import { ColumnInstance } from 'react-table'
import { CustomCellProps } from '../../Table'

import './encryptedCell.scss'

interface ExtendedColumn extends ColumnInstance {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

function IconCell({ cell }: CustomCellProps) {
  const { value, column } = cell
  const { Icon } = column as ExtendedColumn
  return (
    <div className='encrypted-cell'>
      {value && <Icon />}
    </div>
  )
}

export default IconCell

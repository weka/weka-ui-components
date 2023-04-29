import React from 'react'
import { CustomCellProps } from '../../Table'
import SpanTooltip from '../../../SpanTooltip/SpanTooltip'

import './multilineCell.scss'

function MultilineCell({ cell }: CustomCellProps) {
  const { value } = cell

  return (
    <div className='multiline-cell'>
      {(value as string[])?.map((line, index) => (
        <div key={index}>
          <SpanTooltip extraClasses='tooltip'>{line}</SpanTooltip>
        </div>
      ))}
    </div>
  )
}

export default MultilineCell

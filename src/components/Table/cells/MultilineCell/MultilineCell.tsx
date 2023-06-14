import React from 'react'
import { CustomCellProps } from '../../Table'
import SpanTooltip from '../../../SpanTooltip/SpanTooltip'

import './multilineCell.scss'

function MultilineCell({ cell }: CustomCellProps) {
  const { value } = cell

  return (
    <div className='multiline-cell'>
      {(value as (string | null)[])?.map((line, index) => (
        <div key={index}>
          {line ? (
            <SpanTooltip extraClasses='tooltip'>{line}</SpanTooltip>
          ) : (
            <br />
          )}
        </div>
      ))}
    </div>
  )
}

export default MultilineCell

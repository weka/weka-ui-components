import React from 'react'
import { CustomCellProps } from '../../Table'

function ProgressCell({ cell }: CustomCellProps) {
  const { value } = cell
  const { status, progress } = value
  const stringToShow = progress !== 'N/A' ? `${status} - ${progress}` : status
  return (
    <div>
      {stringToShow}
    </div>
  )
}

export default ProgressCell

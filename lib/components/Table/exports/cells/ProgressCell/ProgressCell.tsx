import React from 'react'

import type { ExtendedCellProps } from '../../../types'

export type ProgressCellValue = {
  status: string
  progress: string
}

function ProgressCell<Data>({
  cell,
  customValue
}: ExtendedCellProps<Data, ProgressCellValue>) {
  const value = customValue !== undefined ? customValue : cell.getValue()

  const { status, progress } = value

  const stringToShow = progress !== 'N/A' ? `${status} - ${progress}` : status
  return <div>{stringToShow}</div>
}

export default ProgressCell

import React from 'react'
import Tooltip from '../../../Tooltip'
import { CellValue } from 'react-table'
import { EMPTY_STRING } from '../../../../consts'

interface CustomTooltipProps {
  value: CellValue
  tooltipData?: string
}

function CustomTooltipCell({ value, tooltipData = EMPTY_STRING }: CustomTooltipProps) {
  return (
    <Tooltip data={tooltipData}>
      <span>
        {value}
      </span>
    </Tooltip>
  )
}

export default CustomTooltipCell

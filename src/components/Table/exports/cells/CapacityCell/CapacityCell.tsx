import React from 'react'
import Tooltip from '../../../../Tooltip'
import CapacityBar from '../../../../CapacityBar'
import Utils from '../../../../../utils'
import SpanTooltip from '../../../../SpanTooltip'
import { ExtendedCellProps } from '../../../types'

import './capacityCell.scss'

export interface CapacityCellOptions {
  noDataLabel?: string
}

export interface CapacityCellValue {
  used: number
  total: number
  isThin: boolean
  maxThin: number
  minThin: number
  caution: boolean
}

function getBarColor(used: number, total: number, caution = false) {
  try {
    const percent = used / total
    if (caution) {
      return 'var(--optimus-s2)'
    }
    if (percent >= 1) {
      return 'var(--focus-s1)'
    }
    if (percent > 0.97) {
      return 'var(--optimus-key)'
    }
    return 'var(--accent-key)'
  } catch (e) {
    return 'var(--accent-key)'
  }
}

export const CapacityCellName = 'CapacityCell'

function CapacityCell<Data>(props: ExtendedCellProps<Data, CapacityCellValue>) {
  const { cell, customValue } = props

  const cellDef = cell.column.columnDef.meta?.cell

  if (cellDef && cellDef.type !== CapacityCellName) {
    throw new Error(
      `${CapacityCellName}: cell options are missing or the type is incorrect`
    )
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const { noDataLabel = 'Unknown' } = cellDef?.options ?? {}

  const { used, total, isThin, maxThin, minThin, caution } = value
  const formatTotal = Utils.formatBytes(total, 2)
  const formatUsed = Utils.formatBytes(used, 2)

  const text = total
    ? `${formatUsed.value} ${formatUsed.text} out of ${formatTotal.value} ${
        formatTotal.text
      } (${((used / total) * 100).toFixed(1)}%)`
    : noDataLabel

  return (
    <div className='capacity-cell'>
      <div className='capacity-cell-headline'>
        <SpanTooltip extraClasses='label-4'>{text}</SpanTooltip>
        {isThin && (
          <Tooltip
            data={`Thinly Provisioned Filesystem\nMax SSD: ${Utils.formatBytesToString(
              maxThin
            )}\nMin SSD: ${Utils.formatBytesToString(minThin)}`}
          >
            <div className='thin-provision' />
          </Tooltip>
        )}
      </div>
      <div className='capacity-cell-data'>
        <CapacityBar
          firstUsage={total ? used / total : 0}
          firstColor={getBarColor(used, total, caution)}
        />
      </div>
    </div>
  )
}

export default CapacityCell

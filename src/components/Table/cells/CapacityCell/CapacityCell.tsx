import React from 'react'
import Tooltip from '../../../Tooltip'
import CapacityBar from '../../../CapacityBar'
import Utils from '../../../../utils'
import { CustomCellProps } from '../../Table'
import { ColumnInstance } from 'react-table'

import './capacityCell.scss'

interface ExtendedColumn extends ColumnInstance {
  noDataLabel: string
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

function CapacityCell({ cell }: CustomCellProps) {
  const { value, column } = cell
  const { noDataLabel = 'Unknown' } = column as ExtendedColumn
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
        <span className='label-4' title={text}>
          {text}
        </span>
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

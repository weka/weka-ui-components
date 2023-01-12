import React from 'react'
import propTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Tooltip, CapacityBar } from '@weka.io/weka-ui-components'
import Utils from '../../../../utils/utils'
import { NAMESPACES } from '../../../../utils/consts'

import './capacityCell.scss'

function getBarColor(used, total, caution = false) {
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

function CapacityCell({ cell }) {
  const { t } = useTranslation([NAMESPACES.GENERAL, NAMESPACES.FILESYSTEMS])
  const { value, column: { noDataLabel = t(`${NAMESPACES.GENERAL}:UNKNOWN`) } } = cell
  const { used, total, isThin, maxThin, minThin, caution } = value
  const formatTotal = Utils.formatBytes(total, 2)
  const formatUsed = Utils.formatBytes(used, 2)

  return (
    <div className='capacity-cell'>
      <div className='capacity-cell-headline'>
        <span className='label-4'>
          {total
            ? t(`${NAMESPACES.FILESYSTEMS}:FS_USED_OUT_OF_TOTAL`, { used: `${formatUsed.value} ${formatUsed.text}`, total: `${formatTotal.value} ${formatTotal.text}`, percentage: ((used / total) * 100).toFixed(1) })
            : noDataLabel}
        </span>
        { isThin && (
          <Tooltip data={t(`${NAMESPACES.FILESYSTEMS}:THINLY_PROVISIONED_FS`, { maxThin: Utils.formatBytesToString(maxThin), minThin: Utils.formatBytesToString(minThin) })}>
            <div className='thin-provision' />
          </Tooltip>
        )}
      </div>
      <div className='capacity-cell-data'>
        <CapacityBar firstUsage={total ? used / total : 0} firstColor={getBarColor(used, total, caution)} />
      </div>
    </div>
  )
}

CapacityCell.propTypes = { cell: propTypes.object.isRequired }

export default CapacityCell

import type { ReactElement } from 'react'

import { formatCapacitySmart, UNIT_TYPES } from '#v2/utils/capacityUtils'
import { PERCENTAGE } from '#v2/utils/consts'

import { CapacityProgressBar } from '../../CapacityProgressBar'
import { Tooltip } from '../../Tooltip'

import styles from './capacityCell.module.scss'

const UNLIMITED_LABEL = 'Unlimited'

export interface CapacityCellBadge {
  label: string
  tooltip?: string | ReactElement
}

export interface CapacityCellProps {
  used: number
  total: number
  unlimitedWhenZero?: boolean
  unitType?: string
  badge?: CapacityCellBadge
}

export function CapacityCell({
  used,
  total,
  unlimitedWhenZero,
  unitType = UNIT_TYPES.BASE10,
  badge
}: Readonly<CapacityCellProps>) {
  const isUnlimited = unlimitedWhenZero && total === 0
  const percentage = total > 0 ? (used / total) * PERCENTAGE.FULL : 0
  const usedFormatted = formatCapacitySmart({ bytes: used, unitType })
  const totalFormatted = formatCapacitySmart({ bytes: total, unitType })

  const badgePill = badge ? (
    <span className={styles.badge}>{badge.label}</span>
  ) : null

  return (
    <div className={styles.capacityCell}>
      <div className={styles.capacityBarContainer}>
        <CapacityProgressBar
          extraClass={styles.capacityBar}
          percentage={percentage}
          showPercentageText={!isUnlimited}
        />
      </div>
      <div className={styles.capacityText}>
        <span className={styles.usedValue}>
          <span className={styles.number}>{usedFormatted.value}</span>
          <span className={styles.unit}>{usedFormatted.unit}</span>
        </span>
        <span className={styles.separator}> | </span>
        {isUnlimited ? (
          <span className={styles.totalValue}>{UNLIMITED_LABEL}</span>
        ) : (
          <span className={styles.totalValue}>
            <span className={styles.number}>{totalFormatted.value}</span>
            <span className={styles.unit}>{totalFormatted.unit}</span>
          </span>
        )}
        {badge?.tooltip ? (
          <Tooltip data={badge.tooltip}>{badgePill}</Tooltip>
        ) : (
          badgePill
        )}
      </div>
    </div>
  )
}

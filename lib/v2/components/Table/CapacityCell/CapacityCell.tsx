import { formatCapacitySmart, UNIT_TYPES } from '#v2/utils/capacityUtils'

import { CapacityProgressBar } from '../../CapacityProgressBar'

import styles from './capacityCell.module.scss'

const UNLIMITED_LABEL = 'Unlimited'
const FULL_PERCENTAGE = 100

export interface CapacityCellProps {
  used: number
  total: number
  unlimitedWhenZero?: boolean
  unitType?: string
}

export function CapacityCell({
  used,
  total,
  unlimitedWhenZero,
  unitType = UNIT_TYPES.BASE10
}: Readonly<CapacityCellProps>) {
  const isUnlimited = unlimitedWhenZero && total === 0
  const percentage = total > 0 ? (used / total) * FULL_PERCENTAGE : 0
  const usedFormatted = formatCapacitySmart({ bytes: used, unitType })
  const totalFormatted = formatCapacitySmart({ bytes: total, unitType })

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
      </div>
    </div>
  )
}

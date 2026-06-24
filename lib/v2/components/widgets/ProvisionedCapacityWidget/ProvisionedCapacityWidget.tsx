import { PERCENTAGE } from '#v2/utils/consts'

import styles from './provisionedCapacityWidget.module.scss'

/** Threshold below which values are considered effectively zero */
const ZERO_THRESHOLD = 0.01
const LARGE_VALUE_THRESHOLD = 100
const MEDIUM_VALUE_THRESHOLD = 10

export interface ProvisionedCapacityData {
  used: number
  free: number
  total: number
  usedPercentage: number
  unit?: string
  usedDisplay?: string
  freeDisplay?: string
  totalDisplay?: string
}

export interface ProvisionedCapacityWidgetLabels {
  written: string
  provisioned: string
}

export interface ProvisionedCapacityWidgetProps {
  data: ProvisionedCapacityData
  labels?: Partial<ProvisionedCapacityWidgetLabels>
}

const DEFAULT_LABELS: ProvisionedCapacityWidgetLabels = {
  written: 'Written',
  provisioned: 'Provisioned'
}

export function ProvisionedCapacityWidget({
  data,
  labels: labelsProp
}: Readonly<ProvisionedCapacityWidgetProps>) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const {
    used,
    total,
    usedPercentage,
    unit = 'TB',
    usedDisplay,
    totalDisplay
  } = data
  const displayPercentage =
    usedPercentage === PERCENTAGE.FULL
      ? '100%'
      : `${usedPercentage.toFixed(1)}%`
  const fillHeight = Math.min(PERCENTAGE.FULL, Math.max(0, usedPercentage))

  const formatValue = (value: number, displayValue?: string) => {
    if (displayValue) {
      return displayValue.split(' ')[0]
    }
    if (value === 0 || Math.abs(value) < ZERO_THRESHOLD) {
      return '0'
    }
    if (value >= LARGE_VALUE_THRESHOLD) {
      return value.toFixed(0)
    }
    if (value >= MEDIUM_VALUE_THRESHOLD) {
      return value.toFixed(1)
    }
    return value.toFixed(2)
  }

  const getUnit = (displayValue?: string) => {
    if (displayValue) {
      return displayValue.split(' ')[1] || unit
    }
    return unit
  }

  return (
    <div className={styles.container}>
      <div className={styles.chartSection}>
        <div className={styles.chartContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ height: `${fillHeight}%` }}
            />
          </div>
          <div className={styles.percentageLabel}>
            <span className={styles.percentage}>{displayPercentage}</span>
            <span className={styles.percentageText}>{labels.written}</span>
          </div>
        </div>
      </div>
      <div className={styles.valuesSection}>
        <div className={styles.capacityDetails}>
          <div className={styles.capacityItem}>
            <div className={styles.capacityValue}>
              <span className={styles.number}>
                {formatValue(used, usedDisplay)}
              </span>
              <span className={styles.unit}> {getUnit(usedDisplay)}</span>
            </div>
            <div className={styles.capacityLabel}>
              <span className={styles.usedDot} />
              <span className={styles.labelText}>{labels.written}</span>
            </div>
          </div>
          <div className={styles.capacityItem}>
            <div className={styles.capacityValue}>
              <span className={styles.number}>
                {formatValue(total, totalDisplay)}
              </span>
              <span className={styles.unit}> {getUnit(totalDisplay)}</span>
            </div>
            <div className={styles.capacityLabel}>
              <span className={styles.labelText}>{labels.provisioned}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import clsx from 'clsx'

import { EMPTY_STRING, PERCENTAGE } from '#v2/utils/consts'

import { DonutChart } from '../../charts/DonutChart'

import styles from './capacityWidget.module.scss'

/** Number of decimal places for formatting small values under 1 */
const SMALL_VALUE_DECIMALS = 3
const SMALL_VALUE_THRESHOLD = 1
const MEDIUM_VALUE_THRESHOLD = 10

export interface CapacityData {
  used: number
  free: number
  total: number
  provisioned?: number
  unit?: string
  usedDisplay?: string
  freeDisplay?: string
  totalDisplay?: string
  dataReduction?: {
    ratio: string
    savings: string
  }
}

export interface CapacityWidgetLabels {
  used: string
  free: string
  totalUsable: string
  provisioned: string
  dataReduction: string
  saving: string
}

export interface CapacityWidgetProps {
  data: CapacityData
  showProvisioned?: boolean
  labels?: Partial<CapacityWidgetLabels>
}

const DEFAULT_LABELS: CapacityWidgetLabels = {
  used: 'Used',
  free: 'Free',
  totalUsable: 'Total Usable',
  provisioned: 'Provisioned',
  dataReduction: 'Data Reduction',
  saving: 'Saving'
}

const fuchsiaGradient = (
  <linearGradient
    id='fuchsiaGradient'
    x1='0%'
    x2='100%'
    y1='0%'
    y2='0%'
  >
    <stop
      offset='0%'
      stopColor='var(--fuchsia-600-400)'
    />
    <stop
      offset='100%'
      stopColor='var(--fuchsia-400-600)'
    />
  </linearGradient>
)

export function CapacityWidget({
  data,
  showProvisioned = false,
  labels: labelsProp
}: Readonly<CapacityWidgetProps>) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const {
    used,
    free,
    total,
    provisioned,
    dataReduction,
    unit = 'TB',
    usedDisplay,
    freeDisplay,
    totalDisplay
  } = data

  const usedPercentage = total > 0 ? (used / total) * PERCENTAGE.FULL : 0
  const displayPercentage =
    usedPercentage === PERCENTAGE.FULL
      ? '100%'
      : `${usedPercentage.toFixed(1)}%`

  const chartData = [
    { name: 'Used', value: used, color: 'url(#fuchsiaGradient)' },
    { name: 'Free', value: free, color: 'var(--gray-300-700)' }
  ]

  const formatValue = (value: number, displayValue?: string) => {
    if (displayValue) {
      return displayValue
    }
    if (unit === 'GB') {
      return value < MEDIUM_VALUE_THRESHOLD
        ? `${value.toFixed(1)} ${unit}`
        : `${value.toFixed(0)} ${unit}`
    }
    if (value < SMALL_VALUE_THRESHOLD) {
      return `${value.toFixed(SMALL_VALUE_DECIMALS)} ${unit}`
    }
    if (value < MEDIUM_VALUE_THRESHOLD) {
      return `${value.toFixed(2)} ${unit}`
    }
    return `${value.toFixed(1)} ${unit}`
  }

  const getValuePart = (displayValue: string) => displayValue.split(' ')[0]

  const getUnitPart = (displayValue: string) =>
    displayValue.split(' ')[1] || unit

  const getSavingsValuePart = (savings: string) => {
    const parts = savings.split(' ')
    return parts[0] || savings
  }

  const getSavingsUnitPart = (savings: string) => {
    const parts = savings.split(' ')
    return parts[1] || EMPTY_STRING
  }

  const renderCenterLabel = () => (
    <div className={styles.centerText}>
      <div className={styles.percentage}>{displayPercentage}</div>
      <div className={styles.usedAmount}>
        (
        <span className={styles.number}>
          {getValuePart(formatValue(used, usedDisplay))}
        </span>
        <span className={styles.unit}>
          {' '}
          {getUnitPart(formatValue(used, usedDisplay))}
        </span>
        )
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <div
        className={clsx(
          styles.topSection,
          !dataReduction && styles.noDataReductionLayout
        )}
      >
        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            <DonutChart
              defs={fuchsiaGradient}
              segments={chartData}
            />
            {renderCenterLabel()}
          </div>
        </div>
        <div className={styles.valuesSection}>
          <div className={styles.capacityDetails}>
            <div className={styles.capacityItem}>
              <div className={styles.capacityValue}>
                <span className={styles.number}>
                  {getValuePart(formatValue(used, usedDisplay))}
                </span>
                <span className={styles.unit}>
                  {' '}
                  {getUnitPart(formatValue(used, usedDisplay))}
                </span>
              </div>
              <div className={styles.capacityLabel}>
                <span className={styles.usedDot} />
                {labels.used}
              </div>
            </div>
            <div className={styles.capacityItem}>
              <div className={styles.capacityValue}>
                <span className={styles.number}>
                  {getValuePart(formatValue(free, freeDisplay))}
                </span>
                <span className={styles.unit}>
                  {' '}
                  {getUnitPart(formatValue(free, freeDisplay))}
                </span>
              </div>
              <div className={styles.capacityLabel}>
                <span className={styles.freeDot} />
                {labels.free}
              </div>
            </div>
            <div className={styles.capacityItem}>
              <div className={styles.capacityValue}>
                <span className={styles.number}>
                  {getValuePart(formatValue(total, totalDisplay))}
                </span>
                <span className={styles.unit}>
                  {' '}
                  {getUnitPart(formatValue(total, totalDisplay))}
                </span>
              </div>
              <div className={styles.capacityLabel}>{labels.totalUsable}</div>
            </div>
            {showProvisioned && provisioned ? (
              <div className={styles.capacityItem}>
                <div className={styles.capacityValue}>
                  <span className={styles.number}>
                    {getValuePart(formatValue(provisioned))}
                  </span>
                  <span className={styles.unit}>
                    {' '}
                    {getUnitPart(formatValue(provisioned))}
                  </span>
                </div>
                <div className={styles.capacityLabel}>{labels.provisioned}</div>
              </div>
            ) : null}
          </div>
          {dataReduction ? (
            <>
              <div className={styles.separator} />
              <div className={styles.dataReduction}>
                {labels.dataReduction}:{' '}
                <span className={styles.dataReductionRatio}>
                  {dataReduction.ratio}
                </span>
                {dataReduction.savings ? (
                  <span className={styles.dataReductionSavings}>
                    {' '}
                    ({labels.saving}{' '}
                    <span className={styles.savingsValue}>
                      {getSavingsValuePart(dataReduction.savings)}
                    </span>
                    <span className={styles.savingsUnit}>
                      {' '}
                      {getSavingsUnitPart(dataReduction.savings)}
                    </span>
                    )
                  </span>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
      {dataReduction ? (
        <div className={styles.dataReductionBelow}>
          {labels.dataReduction}:{' '}
          <span className={styles.dataReductionRatio}>
            {dataReduction.ratio}
          </span>
          {dataReduction.savings ? (
            <span className={styles.dataReductionSavingsSmall}>
              {' '}
              ({labels.saving}{' '}
              <span className={styles.savingsValueSmall}>
                {getSavingsValuePart(dataReduction.savings)}
              </span>
              <span className={styles.savingsUnitSmall}>
                {' '}
                {getSavingsUnitPart(dataReduction.savings)}
              </span>
              )
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

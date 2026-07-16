import type { CapacityUsableData, CapacityWidgetLabels } from '../types'

import { useId } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import { DonutChart } from '../../../charts/DonutChart'
import {
  clampPercentage,
  DEFAULT_CAPACITY_UNIT,
  formatCapacity,
  formatPercentage,
  toPercentage
} from '../capacityFormat'
import { LegendItem } from '../LegendItem'
import { TotalPill } from '../TotalPill'

import styles from '../capacityWidget.module.scss'

export interface UsableSectionProps {
  data: CapacityUsableData
  labels: CapacityWidgetLabels
}

export function UsableSection({ data, labels }: Readonly<UsableSectionProps>) {
  const gradientId = `capacityUsedGradient-${useId().replace(/:/g, EMPTY_STRING)}`
  const {
    used,
    free,
    total,
    unit = DEFAULT_CAPACITY_UNIT,
    usedDisplay,
    freeDisplay,
    totalDisplay,
    dataReduction
  } = data

  const usedAmount = formatCapacity(used, unit, usedDisplay)
  const percentage = formatPercentage(clampPercentage(toPercentage(used, total)))

  const segments = [
    { name: labels.used, value: used, color: `url(#${gradientId})` },
    { name: labels.free, value: free, color: 'var(--gray-300-700)' }
  ]

  const savings = dataReduction
    ? formatCapacity(0, EMPTY_STRING, dataReduction.savings)
    : null

  return (
    <div className={styles.usableSection}>
      <div
        className={clsx(
          styles.usableBody,
          !dataReduction && styles.usableBodyNoDr
        )}
      >
        <div className={styles.donut}>
          <DonutChart
            segments={segments}
            defs={
              <linearGradient
                id={gradientId}
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
            }
          />
          <div className={styles.donutCenter}>
            <div className={styles.donutPercent}>{percentage}</div>
            <div className={styles.donutUsed}>
              ({usedAmount.value}
              <span className={styles.donutUsedUnit}> {usedAmount.unit}</span>)
            </div>
          </div>
        </div>
        <div
          className={clsx(
            styles.usableLegend,
            !dataReduction && styles.usableLegendNoDr
          )}
        >
          <LegendItem
            amount={usedAmount}
            dotClass={styles.dotUsed}
            label={labels.used}
          />
          <LegendItem
            amount={formatCapacity(free, unit, freeDisplay)}
            dotClass={styles.dotFree}
            label={labels.free}
          />
          {dataReduction && savings ? (
            <div className={styles.dataReduction}>
              <div className={styles.legendLabel}>{labels.dataReduction}</div>
              <div className={styles.dataReductionRatio}>
                {dataReduction.ratio}
              </div>
              {dataReduction.savings ? (
                <div className={styles.saving}>
                  ({labels.saving} {savings.value}
                  <span className={styles.savingUnit}> {savings.unit}</span>)
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <TotalPill
        amount={formatCapacity(total, unit, totalDisplay)}
        label={labels.totalUsable}
      />
    </div>
  )
}

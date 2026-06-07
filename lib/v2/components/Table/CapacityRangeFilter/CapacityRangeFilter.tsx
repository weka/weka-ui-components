import { useState } from 'react'
import clsx from 'clsx'

import {
  CAPACITY_RANGE_MODES,
  type CapacityRangeFilterType,
  type CapacityRangeMode,
  type CapacityRangeValueRuntime,
  type CapacityUnit
} from './capacityRangeFilterTypes'
import Range from './Range'

import styles from './capacityRangeFilter.module.scss'

const DEFAULT_MODE_LABELS = {
  used: 'Used',
  total: 'Total'
} as const

export interface CapacityRangeFilterProps {
  onChange?: (filter: CapacityRangeFilterType) => void
  initialValues?: CapacityRangeFilterType
  modeLabels?: { used?: string; total?: string }
  unitOptions: CapacityUnit[]
}

export function CapacityRangeFilter({
  onChange,
  initialValues,
  modeLabels,
  unitOptions
}: Readonly<CapacityRangeFilterProps>) {
  const [mode, setMode] = useState<CapacityRangeMode>(
    initialValues?.mode || CAPACITY_RANGE_MODES.USED
  )

  const [usedCapacity, setUsedCapacity] = useState<CapacityRangeValueRuntime>(
    initialValues?.used || { min: undefined, max: undefined }
  )

  const [totalCapacity, setTotalCapacity] = useState<CapacityRangeValueRuntime>(
    initialValues?.total || { min: undefined, max: undefined }
  )

  const handleModeChange = (newMode: CapacityRangeMode) => {
    setMode(newMode)
    onChange?.({ mode: newMode, used: usedCapacity, total: totalCapacity })
  }

  const handleUsedCapacityChange = (newValues: CapacityRangeValueRuntime) => {
    setUsedCapacity(newValues)
    onChange?.({ mode, used: newValues, total: totalCapacity })
  }

  const handleTotalCapacityChange = (newValues: CapacityRangeValueRuntime) => {
    setTotalCapacity(newValues)
    onChange?.({ mode, used: usedCapacity, total: newValues })
  }

  const contentByMode = {
    [CAPACITY_RANGE_MODES.USED]: (
      <Range
        key={CAPACITY_RANGE_MODES.USED}
        onChange={handleUsedCapacityChange}
        unitOptions={unitOptions}
        values={usedCapacity}
      />
    ),
    [CAPACITY_RANGE_MODES.TOTAL]: (
      <Range
        key={CAPACITY_RANGE_MODES.TOTAL}
        onChange={handleTotalCapacityChange}
        unitOptions={unitOptions}
        values={totalCapacity}
      />
    )
  }

  return (
    <div className={styles.capacityRangeFilter}>
      <div
        aria-label='Capacity filter mode'
        className={styles.toggleContainer}
        role='group'
      >
        <button
          aria-label='Filter by used capacity'
          aria-pressed={mode === CAPACITY_RANGE_MODES.USED}
          data-testid='capacity-filter-used-tab'
          onClick={() => handleModeChange(CAPACITY_RANGE_MODES.USED)}
          type='button'
          className={clsx(styles.toggleButton, {
            [styles.toggleButtonActive]: mode === CAPACITY_RANGE_MODES.USED
          })}
        >
          {modeLabels?.used ?? DEFAULT_MODE_LABELS.used}
        </button>
        <button
          aria-label='Filter by total capacity'
          aria-pressed={mode === CAPACITY_RANGE_MODES.TOTAL}
          data-testid='capacity-filter-total-tab'
          onClick={() => handleModeChange(CAPACITY_RANGE_MODES.TOTAL)}
          type='button'
          className={clsx(styles.toggleButton, {
            [styles.toggleButtonActive]: mode === CAPACITY_RANGE_MODES.TOTAL
          })}
        >
          {modeLabels?.total ?? DEFAULT_MODE_LABELS.total}
        </button>
      </div>
      {contentByMode[mode]}
    </div>
  )
}

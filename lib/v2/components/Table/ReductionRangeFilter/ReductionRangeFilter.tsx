import type {
  CapacityRangeValueRuntime,
  CapacityUnit
} from '../CapacityRangeFilter/capacityRangeFilterTypes'
import type { NumRangeFilterType } from '../NumberRange'

import { useState } from 'react'
import clsx from 'clsx'

import Range from '../CapacityRangeFilter/Range'
import { NumberRange } from '../NumberRange'
import {
  REDUCTION_RANGE_LABELS,
  REDUCTION_RANGE_MODES,
  type ReductionRangeFilterType,
  type ReductionRangeMode
} from './reductionRangeFilterTypes'

import styles from './reductionRangeFilter.module.scss'

export interface ReductionRangeFilterProps {
  onChange?: (filter: ReductionRangeFilterType) => void
  initialValues?: ReductionRangeFilterType
  unitOptions: CapacityUnit[]
}

export function ReductionRangeFilter({
  onChange,
  initialValues,
  unitOptions
}: Readonly<ReductionRangeFilterProps>) {
  const [mode, setMode] = useState<ReductionRangeMode>(
    initialValues?.mode || REDUCTION_RANGE_MODES.RATIO
  )

  const [ratio, setRatio] = useState<NumRangeFilterType>(
    initialValues?.ratio || { min: null, max: null }
  )

  const [reducedSize, setReducedSize] = useState<CapacityRangeValueRuntime>(
    initialValues?.reducedSize || { min: undefined, max: undefined }
  )

  const handleModeChange = (newMode: ReductionRangeMode) => {
    setMode(newMode)
    onChange?.({ mode: newMode, ratio, reducedSize })
  }

  const handleRatioChange = (newRatio: NumRangeFilterType) => {
    setRatio(newRatio)
    onChange?.({ mode, ratio: newRatio, reducedSize })
  }

  const handleReducedSizeChange = (newSize: CapacityRangeValueRuntime) => {
    setReducedSize(newSize)
    onChange?.({ mode, ratio, reducedSize: newSize })
  }

  return (
    <div className={styles.reductionRangeFilter}>
      <div
        aria-label='Reduction filter mode'
        className={styles.toggleContainer}
        role='group'
      >
        <button
          aria-label='Filter by ratio'
          aria-pressed={mode === REDUCTION_RANGE_MODES.RATIO}
          data-testid='reduction-filter-ratio-tab'
          onClick={() => handleModeChange(REDUCTION_RANGE_MODES.RATIO)}
          type='button'
          className={clsx(styles.toggleButton, {
            [styles.toggleButtonActive]: mode === REDUCTION_RANGE_MODES.RATIO
          })}
        >
          {REDUCTION_RANGE_LABELS[REDUCTION_RANGE_MODES.RATIO]}
        </button>
        <button
          aria-label='Filter by reduced size'
          aria-pressed={mode === REDUCTION_RANGE_MODES.REDUCED_SIZE}
          data-testid='reduction-filter-size-tab'
          onClick={() => handleModeChange(REDUCTION_RANGE_MODES.REDUCED_SIZE)}
          type='button'
          className={clsx(styles.toggleButton, {
            [styles.toggleButtonActive]:
              mode === REDUCTION_RANGE_MODES.REDUCED_SIZE
          })}
        >
          {REDUCTION_RANGE_LABELS[REDUCTION_RANGE_MODES.REDUCED_SIZE]}
        </button>
      </div>
      {mode === REDUCTION_RANGE_MODES.RATIO ? (
        <div className={styles.ratioWrapper}>
          <NumberRange
            initialValues={ratio}
            onChange={handleRatioChange}
          />
        </div>
      ) : (
        <div className={styles.sizeWrapper}>
          <Range
            onChange={handleReducedSizeChange}
            unitOptions={unitOptions}
            values={reducedSize}
          />
        </div>
      )}
    </div>
  )
}

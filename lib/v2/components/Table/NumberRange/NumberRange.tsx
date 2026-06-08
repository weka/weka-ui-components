import { useState } from 'react'

import { ANY_LABEL, EMPTY_STRING } from '#v2/utils/consts'

import { NumberInput } from '../../inputs/NumberInput'

import styles from './numberRange.module.scss'

export interface NumRangeFilterType {
  min: number | null
  max: number | null
}

export interface NumberRangeProps {
  initialValues: NumRangeFilterType
  onChange: (values: NumRangeFilterType) => void
}

const MIN_VALUE = 0

export function NumberRange({
  initialValues,
  onChange
}: Readonly<NumberRangeProps>) {
  const [minValue, setMinValue] = useState<string>(
    initialValues.min !== null ? String(initialValues.min) : EMPTY_STRING
  )
  const [maxValue, setMaxValue] = useState<string>(
    initialValues.max !== null ? String(initialValues.max) : EMPTY_STRING
  )

  const handleMinChange = (value: string) => {
    setMinValue(value)

    const numericMin = value === EMPTY_STRING ? null : parseFloat(value)
    const numericMax = maxValue === EMPTY_STRING ? null : parseFloat(maxValue)

    if (value === EMPTY_STRING || (!isNaN(numericMin!) && numericMin! >= 0)) {
      onChange({
        min: numericMin,
        max: numericMax
      })
    }
  }

  const handleMaxChange = (value: string) => {
    setMaxValue(value)

    const numericMin = minValue === EMPTY_STRING ? null : parseFloat(minValue)
    const numericMax = value === EMPTY_STRING ? null : parseFloat(value)

    if (value === EMPTY_STRING || !isNaN(numericMax!)) {
      onChange({
        min: numericMin,
        max: numericMax
      })
    }
  }

  return (
    <div className={styles.numRange}>
      <NumberInput
        dataTestId='number-range-min-input'
        id='numberRangeMin'
        label='Min.'
        min={MIN_VALUE}
        onChange={handleMinChange}
        placeholder={ANY_LABEL}
        showArrows
        value={minValue}
      />
      <NumberInput
        dataTestId='number-range-max-input'
        id='numberRangeMax'
        label='Max.'
        min={MIN_VALUE}
        onChange={handleMaxChange}
        placeholder={ANY_LABEL}
        showArrows
        value={maxValue}
      />
    </div>
  )
}

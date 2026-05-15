import type { ChangeEvent } from 'react'

import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import { NumInputSpinButton } from '../../NumInputSpinButton'

import styles from './numberInput.module.scss'

const DEFAULT_STEP = 1
const DEFAULT_FALLBACK_VALUE = 0

export interface NumberInputProps {
  id?: string
  name?: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  extraClass?: string
  label?: string
  required?: boolean
  showArrows?: boolean
  dataTestId?: string
}

export function NumberInput({
  id,
  name,
  value,
  onChange,
  placeholder = EMPTY_STRING,
  disabled = false,
  min,
  max,
  step,
  extraClass = EMPTY_STRING,
  label,
  required = false,
  showArrows = false,
  dataTestId
}: Readonly<NumberInputProps>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleIncrement = () => {
    if (disabled) {
      return
    }
    const currentValue = Number(value) || DEFAULT_FALLBACK_VALUE
    const newValue = currentValue + (step || DEFAULT_STEP)
    if (max === undefined || newValue <= max) {
      onChange(String(newValue))
    }
  }

  const handleDecrement = () => {
    if (disabled) {
      return
    }
    const currentValue = Number(value) || DEFAULT_FALLBACK_VALUE
    const newValue = currentValue - (step || DEFAULT_STEP)
    if (min === undefined || newValue >= min) {
      onChange(String(newValue))
    }
  }

  return (
    <div className={styles.inputWrapper}>
      {label ? (
        <label
          className={styles.label}
          htmlFor={id}
        >
          {label}
          {required ? <span className={styles.required}> *</span> : null}
        </label>
      ) : null}
      <div className={clsx(showArrows && styles.inputWithArrows)}>
        <input
          autoComplete='off'
          {...(dataTestId && { 'data-testid': dataTestId })}
          disabled={disabled}
          id={id}
          max={max}
          min={min}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          step={step}
          type='number'
          value={value}
          className={clsx(
            styles.input,
            showArrows && styles.withArrowsPadding,
            extraClass
          )}
        />
        {showArrows ? (
          <NumInputSpinButton
            disabled={disabled}
            onClickDown={handleDecrement}
            onClickUp={handleIncrement}
          />
        ) : null}
      </div>
    </div>
  )
}

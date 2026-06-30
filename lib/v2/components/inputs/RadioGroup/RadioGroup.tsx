import { useId } from 'react'
import clsx from 'clsx'

import styles from './radioGroup.module.scss'

export type RadioValue = string | number | boolean

export interface RadioOption<TValue extends RadioValue = string> {
  label: string
  value: TValue
  disabled?: boolean
}

export type RadioGroupDirection = 'row' | 'column'

export const RADIO_GROUP_DIRECTIONS = {
  ROW: 'row',
  COLUMN: 'column'
} as const

export interface RadioGroupProps<TValue extends RadioValue = string> {
  options: RadioOption<TValue>[]
  value: TValue
  onChange: (value: TValue) => void
  /** Lay the options out in a row (same line) or stacked. Defaults to column. */
  direction?: RadioGroupDirection
  /** Disable the whole group (individual options can also opt out via `disabled`). */
  disabled?: boolean
  /** Shared radio `name`; auto-generated (stable) when omitted. */
  name?: string
  wrapperClass?: string
}

export function RadioGroup<TValue extends RadioValue = string>({
  options,
  value,
  onChange,
  direction = RADIO_GROUP_DIRECTIONS.COLUMN,
  disabled = false,
  name,
  wrapperClass
}: Readonly<RadioGroupProps<TValue>>) {
  const generatedName = useId()
  const groupName = name ?? generatedName

  return (
    <div
      className={clsx(styles.group, styles[direction], wrapperClass)}
      role='radiogroup'
    >
      {options.map((option) => {
        const isDisabled = disabled || Boolean(option.disabled)
        return (
          <label
            key={String(option.value)}
            className={clsx(styles.option, isDisabled && styles.disabled)}
          >
            <input
              checked={option.value === value}
              className={styles.input}
              data-testid={`radio-option-${option.value}`}
              disabled={isDisabled}
              name={groupName}
              onChange={() => onChange(option.value)}
              type='radio'
              value={String(option.value)}
            />
            <span
              aria-hidden
              className={styles.circle}
            />
            <span className={styles.label}>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

import { useId } from 'react'
import clsx from 'clsx'

import styles from './loginField.module.scss'

export const LOGIN_FIELD_TYPES = {
  TEXT: 'text',
  PASSWORD: 'password'
} as const

export type LoginFieldType =
  (typeof LOGIN_FIELD_TYPES)[keyof typeof LOGIN_FIELD_TYPES]

export interface LoginFieldProps {
  label: string
  type?: LoginFieldType
  value: string
  onChange: (value: string) => void
  error?: string
  autoFocus?: boolean
  isRequired?: boolean
  disabled?: boolean
  dataTestId?: string
}

export function LoginField({
  label,
  type = LOGIN_FIELD_TYPES.TEXT,
  value,
  onChange,
  error,
  autoFocus = false,
  isRequired = false,
  disabled = false,
  dataTestId
}: Readonly<LoginFieldProps>) {
  const id = useId()

  return (
    <div className={styles.fieldContainer}>
      <label
        className={styles.label}
        htmlFor={id}
      >
        {label}
        {isRequired ? <span className={styles.required}>*</span> : null}
      </label>
      <input
        autoFocus={autoFocus}
        className={clsx(styles.input, error && styles.inputError)}
        data-testid={dataTestId}
        disabled={disabled}
        id={id}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        value={value}
      />
      {error ? <span className={styles.errorMessage}>{error}</span> : null}
    </div>
  )
}

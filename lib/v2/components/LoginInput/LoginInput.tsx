import type { LoginFieldType } from '../LoginField'
import type { ChangeEvent, ReactNode } from 'react'

import { useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import { WarningCircleIcon } from '../../icons'
import { LOGIN_FIELD_TYPES } from '../LoginField'
import { PasswordToggleButton } from './PasswordToggleButton'

import styles from './loginInput.module.scss'

export interface LoginInputProps {
  value: string
  onChange: (value: string) => void
  type?: LoginFieldType
  startIcon?: ReactNode
  label?: string
  placeholder?: string
  error?: string
  autoFocus?: boolean
  isRequired?: boolean
  disabled?: boolean
  name?: string
  id?: string
  dataTestId?: string
}

export function LoginInput({
  value,
  onChange,
  type = LOGIN_FIELD_TYPES.TEXT,
  startIcon,
  label,
  placeholder = EMPTY_STRING,
  error,
  autoFocus = false,
  isRequired = false,
  disabled = false,
  name,
  id,
  dataTestId
}: Readonly<LoginInputProps>) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === LOGIN_FIELD_TYPES.PASSWORD
  const resolvedType =
    isPassword && showPassword ? LOGIN_FIELD_TYPES.TEXT : type

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={styles.fieldContainer}>
      {label ? (
        <label
          className={styles.label}
          htmlFor={id}
        >
          {label}
          {isRequired ? <span className={styles.required}> *</span> : null}
        </label>
      ) : null}
      <div
        className={clsx(
          styles.inputContent,
          error && styles.hasError,
          disabled && styles.disabled
        )}
      >
        {startIcon ? (
          <span className={styles.startIcon}>{startIcon}</span>
        ) : null}
        <input
          autoComplete='new-password'
          autoFocus={autoFocus}
          className={styles.input}
          data-testid={dataTestId}
          disabled={disabled}
          id={id}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          type={resolvedType}
          value={value}
        />
        {isPassword ? (
          <span className={styles.eyeButton}>
            <PasswordToggleButton
              disabled={disabled}
              isVisible={showPassword}
              onToggle={toggleShowPassword}
            />
          </span>
        ) : null}
      </div>
      {error ? (
        <span className={styles.errorMessage}>
          <WarningCircleIcon filled />
          <span className={styles.errorText}>{error}</span>
        </span>
      ) : null}
    </div>
  )
}

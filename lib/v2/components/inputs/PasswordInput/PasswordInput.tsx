import type { ChangeEvent } from 'react'

import { useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import { EyeIcon } from '../../../icons/EyeIcon'
import { EyeOffIcon } from '../../../icons/EyeOffIcon'
import { IconButton } from '../../IconButton'
import { Tooltip } from '../../Tooltip'
import { PasswordRequirements } from './PasswordRequirements'

import styles from './passwordInput.module.scss'

const SHOW_LABEL = 'Show password'
const HIDE_LABEL = 'Hide password'

export interface PasswordInputProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  extraClass?: string
  label?: string
  required?: boolean
  autoFocus?: boolean
  dataTestId?: string
  showRules?: boolean
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = EMPTY_STRING,
  disabled = false,
  readOnly = false,
  extraClass = EMPTY_STRING,
  label,
  required = false,
  autoFocus = false,
  dataTestId,
  showRules = false
}: Readonly<PasswordInputProps>) {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
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
      <div className={styles.inputContainer}>
        <input
          autoComplete='new-password'
          autoFocus={autoFocus}
          className={clsx(styles.input, extraClass)}
          data-testid={dataTestId}
          disabled={disabled}
          id={id}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          type={showPassword ? 'text' : 'password'}
          value={value}
        />
        <span className={styles.eyeButton}>
          <Tooltip data={showPassword ? HIDE_LABEL : SHOW_LABEL}>
            <IconButton
              ariaLabel={showPassword ? HIDE_LABEL : SHOW_LABEL}
              onClick={toggleShowPassword}
              small
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          </Tooltip>
        </span>
      </div>
      {showRules ? <PasswordRequirements value={value} /> : null}
    </div>
  )
}

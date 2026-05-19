import type { ChangeEvent, FocusEvent } from 'react'

import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import styles from './textInput.module.scss'

export const TEXT_INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  /* eslint-disable-next-line sonarjs/no-hardcoded-passwords -- This is the HTML input type attribute value, not a password. */
  PASSWORD: 'password',
  URL: 'url'
} as const

export type TextInputType =
  (typeof TEXT_INPUT_TYPES)[keyof typeof TEXT_INPUT_TYPES]

export interface TextInputProps {
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
  type?: TextInputType
  autoFocus?: boolean
  selectOnFocus?: boolean
  dataTestId?: string
}

export function TextInput({
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
  type = TEXT_INPUT_TYPES.TEXT,
  autoFocus = false,
  selectOnFocus = false,
  dataTestId
}: Readonly<TextInputProps>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (selectOnFocus) {
      e.target.select()
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
      <input
        autoComplete='off'
        autoFocus={autoFocus}
        className={clsx(styles.input, extraClass)}
        data-testid={dataTestId}
        disabled={disabled}
        id={id}
        name={name}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={value}
      />
    </div>
  )
}

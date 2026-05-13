import type { ChangeEvent } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '../../../utils/consts'

import styles from './textArea.module.scss'

const DEFAULT_ROWS = 4

export interface TextAreaProps {
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
  rows?: number
  dataTestId?: string
}

export function TextArea({
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
  rows = DEFAULT_ROWS,
  dataTestId
}: Readonly<TextAreaProps>) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles.textAreaWrapper}>
      {label ? (
        <label
          className={styles.label}
          htmlFor={id}
        >
          {label}
          {required ? <span className={styles.required}> *</span> : null}
        </label>
      ) : null}
      <textarea
        className={clsx(styles.textArea, extraClass)}
        data-testid={dataTestId}
        disabled={disabled}
        id={id}
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        value={value}
      />
    </div>
  )
}

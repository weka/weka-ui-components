import type { ChangeEvent } from 'react'

import { useId } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

import styles from './fileUpload.module.scss'

export interface FileUploadProps {
  onChange: (file: File | null) => void
  fileName?: string
  accept?: string
  disabled?: boolean
  label?: string
  required?: boolean
  buttonText?: string
  dataTestId?: string
}

export function FileUpload({
  onChange,
  fileName = EMPTY_STRING,
  accept,
  disabled = false,
  label,
  required = false,
  buttonText = 'Choose File',
  dataTestId
}: Readonly<FileUploadProps>) {
  const inputId = useId()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    e.target.value = EMPTY_STRING
  }

  return (
    <div className={styles.wrapper}>
      {label ? (
        <span className={styles.label}>
          {label}
          {required ? (
            <span
              aria-hidden='true'
              className={styles.required}
            >
              {' *'}
            </span>
          ) : null}
        </span>
      ) : null}
      <input
        accept={accept}
        aria-label={label ?? buttonText}
        aria-required={required}
        className={styles.hiddenInput}
        data-testid={dataTestId}
        disabled={disabled}
        id={inputId}
        onChange={handleChange}
        type='file'
      />
      <label
        className={styles.button}
        data-disabled={disabled}
        htmlFor={disabled ? undefined : inputId}
      >
        {buttonText}
      </label>
      {fileName ? <span className={styles.fileName}>{fileName}</span> : null}
    </div>
  )
}

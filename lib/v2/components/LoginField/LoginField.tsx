import clsx from 'clsx'

import styles from './loginField.module.scss'

export interface LoginFieldProps {
  label: string
  type?: string
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
  type = 'text',
  value,
  onChange,
  error,
  autoFocus = false,
  isRequired = false,
  disabled = false,
  dataTestId
}: Readonly<LoginFieldProps>) {
  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>
        {label}
        {isRequired ? <span className={styles.required}>*</span> : null}
      </label>
      <input
        autoFocus={autoFocus}
        className={clsx(styles.input, error && styles.inputError)}
        data-testid={dataTestId}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        value={value}
      />
      {error ? <span className={styles.errorMessage}>{error}</span> : null}
    </div>
  )
}

export default LoginField

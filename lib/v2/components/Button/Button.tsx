import { type MouseEventHandler, type ReactNode } from 'react'
import clsx from 'clsx'

import styles from './Button.module.scss'

export interface ButtonProps {
  /** Button content */
  children: ReactNode
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline'
  /** Button size */
  size?: 'small' | 'medium' | 'large'
  /** Disabled state */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
  /** Full width button */
  fullWidth?: boolean
  /** Click handler */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** Button type */
  type?: 'button' | 'submit' | 'reset'
  /** Additional class name */
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  ...rest
}: Readonly<ButtonProps>) {
  const classes = clsx(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.fullWidth]: fullWidth,
      [styles.loading]: loading,
      [styles.disabled]: disabled
    },
    className
  )

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {loading ? (
        <span
          aria-label='Loading'
          className={styles.spinner}
        />
      ) : (
        children
      )}
    </button>
  )
}

export default Button

import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

export interface ButtonProps {
  /** Button content */
  children: React.ReactNode
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
  onClick?: React.MouseEventHandler<HTMLButtonElement>
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
}: ButtonProps) {
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
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-label="Loading" />
      ) : (
        children
      )}
    </button>
  )
}

export default Button

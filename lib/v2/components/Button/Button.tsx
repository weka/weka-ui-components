import type { ComponentType, ReactNode } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '../../utils/consts'

import styles from './button.module.scss'

export const BUTTON_TYPES = {
  BUTTON: 'button',
  SUBMIT: 'submit',
  RESET: 'reset'
} as const

export type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES]

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
} as const

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS]

export interface ButtonProps {
  variant?: ButtonVariant
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: ButtonType
  extraClass?: string
  isRounded?: boolean
  Icon?: ComponentType<{ color?: string; width?: number; height?: number }>
  title?: string
  dataTestId?: string
}

export function Button({
  variant = BUTTON_VARIANTS.PRIMARY,
  children,
  onClick,
  disabled = false,
  type = BUTTON_TYPES.BUTTON,
  isRounded = false,
  extraClass = EMPTY_STRING,
  title,
  Icon,
  dataTestId
}: Readonly<ButtonProps>) {
  return (
    <button
      data-testid={dataTestId}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type={type}
      className={clsx(styles.button, styles[variant], extraClass, {
        [styles.isRounded]: isRounded,
        [styles.hasIcon]: !!Icon
      })}
    >
      {Icon ? <Icon /> : null}
      {children}
    </button>
  )
}

import clsx from 'clsx'

import { KEYBOARD_KEYS } from '#v2/utils/consts'

import {
  CheckboxCheckedIcon,
  CheckboxPartialIcon,
  CheckboxUncheckedIcon
} from '../../icons'

import styles from './checkBox.module.scss'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  wrapperClass?: string
  partiallyChecked?: boolean
  disabled?: boolean
}

export function Checkbox({
  checked,
  onChange,
  partiallyChecked,
  wrapperClass,
  disabled = false
}: Readonly<CheckboxProps>) {
  function getIcon() {
    if (partiallyChecked) {
      return CheckboxPartialIcon
    }
    if (checked) {
      return CheckboxCheckedIcon
    }
    return CheckboxUncheckedIcon
  }

  const Icon = getIcon()

  return (
    <div
      aria-checked={partiallyChecked ? 'mixed' : checked}
      aria-disabled={disabled}
      className={clsx(styles.checkbox, disabled && styles.disabled, wrapperClass)}
      data-testid='custom-checkbox'
      role='checkbox'
      tabIndex={disabled ? -1 : 0}
      onClick={(event) => {
        event?.stopPropagation()
        if (disabled) {
          return
        }
        onChange(!checked)
      }}
      onKeyDown={(event) => {
        if (disabled) {
          return
        }
        if (
          event.key === KEYBOARD_KEYS.SPACE ||
          event.key === KEYBOARD_KEYS.ENTER
        ) {
          event.preventDefault()
          onChange(!checked)
        }
      }}
    >
      <Icon />
    </div>
  )
}

import clsx from 'clsx'

import {
  CheckboxCheckedIcon,
  CheckboxPartialIcon,
  CheckboxUncheckedIcon
} from '../../icons'
import { KEYBOARD_KEYS } from '../../utils/consts'

import styles from './checkBox.module.scss'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  wrapperClass?: string
  partiallyChecked?: boolean
}

export function Checkbox({
  checked,
  onChange,
  partiallyChecked,
  wrapperClass
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
      className={clsx(styles.checkbox, wrapperClass)}
      data-testid='custom-checkbox'
      role='checkbox'
      tabIndex={0}
      onClick={(event) => {
        event?.stopPropagation()
        onChange(!checked)
      }}
      onKeyDown={(event) => {
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

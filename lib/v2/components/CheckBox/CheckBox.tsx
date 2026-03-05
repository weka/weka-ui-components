import { useMemo } from 'react'
import clsx from 'clsx'

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
}

export function Checkbox({
  checked,
  onChange,
  partiallyChecked,
  wrapperClass,
  ...rest
}: Readonly<CheckboxProps>) {
  const checkboxIcon = useMemo(() => {
    if (partiallyChecked) {
      return <CheckboxPartialIcon {...rest} />
    } else if (checked) {
      return <CheckboxCheckedIcon {...rest} />
    } else {
      return <CheckboxUncheckedIcon {...rest} />
    }
  }, [checked, partiallyChecked, rest])

  return (
    <div
      className={clsx(styles.checkbox, wrapperClass)}
      data-testid='custom-checkbox'
      onClick={(event) => {
        event?.stopPropagation()
        onChange(!checked)
      }}
    >
      {checkboxIcon}
    </div>
  )
}

export default Checkbox

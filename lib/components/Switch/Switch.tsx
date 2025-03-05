import React, { ChangeEvent } from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from 'consts'
import Tooltip from '../Tooltip'

import './switch.scss'
interface SwitchProps {
  onChange: (newValue: any) => void
  disabled?: boolean
  oneColor?: boolean
  checked: boolean
  tooltip?: string
}
function Switch(props: SwitchProps) {
  const {
    onChange,
    oneColor = false,
    checked,
    disabled = false,
    tooltip = EMPTY_STRING,
    ...rest
  } = props
  const classes = clsx({
    'one-color': oneColor,
    'toggle-btn': true,
    disabled
  })

  function onClick(val: ChangeEvent<HTMLInputElement>) {
    // we cant put disabled on the input becasue to tooltip wont work
    if (!disabled) {
      onChange(val)
    }
  }

  return (
    <Tooltip data={tooltip}>
      <div className={classes}>
        <input type='checkbox' checked={checked} onChange={onClick} {...rest} />
        <span />
      </div>
    </Tooltip>
  )
}

export default Switch

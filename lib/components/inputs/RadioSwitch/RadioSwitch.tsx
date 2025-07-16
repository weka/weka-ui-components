import React, { ChangeEvent } from 'react'
import { Radio } from '@mui/material'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import svgs from 'svgs'

import './radioSwitch.scss'

const { Info } = svgs

interface RadioSwitchProps {
  label: string
  value: string
  checked: boolean
  onChange: (newVal: any) => void
  disabled?: boolean
  info?: string
}
function RadioSwitch({
  label,
  checked,
  onChange,
  value,
  disabled,
  info
}: RadioSwitchProps) {
  function onRadioChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  const cls = clsx({
    disabled,
    'radio-switch': true
  })

  return (
    <div className={cls}>
      <Radio
        classes={{ root: 'radio-btn' }}
        checked={checked}
        disabled={disabled}
        onChange={onRadioChange}
        value={value}
      />
      <span className='radio-label'>
        {label}
        {!!info && (
          <Tooltip data={info}>
            <Info />
          </Tooltip>
        )}
      </span>
    </div>
  )
}

export default RadioSwitch

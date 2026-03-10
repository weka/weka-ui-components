import type { ChangeEvent } from 'react'
import React from 'react'
import { Radio } from '@mui/material'
import clsx from 'clsx'

import svgs from 'svgs'

import Tooltip from '../../Tooltip'

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
        checked={checked}
        classes={{ root: 'radio-btn' }}
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

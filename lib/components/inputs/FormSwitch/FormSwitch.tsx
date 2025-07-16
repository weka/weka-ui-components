import React from 'react'
import Tooltip from '../../Tooltip'
import Switch from '../../Switch'
import { EMPTY_STRING } from 'consts'
import svgs from 'svgs'

import './FormSwitch.scss'

const { Info } = svgs

interface FormSwitchProps {
  label: string
  info?: string
  onChange: (newValue: any) => void
  oneColor?: boolean
  disabled?: boolean
  value?: boolean
  placeholder?: boolean
  redInfo?: (value?: boolean) => string
  [key: string]: any
}
function FormSwitch({
  onChange,
  oneColor,
  value,
  label,
  placeholder,
  isRequired,
  info = EMPTY_STRING,
  redInfo = () => EMPTY_STRING,
  ...rest
}: FormSwitchProps) {
  return (
    <div className='form-switch-wrapper'>
      <div className='form-switch'>
        <div>
          <span className='form-switch-label'>{label}</span>
          {info && (
            <Tooltip data={info}>
              <Info className='form-switch-info' />
            </Tooltip>
          )}
        </div>

        <Switch
          onChange={onChange}
          oneColor={oneColor}
          checked={value || placeholder || false}
          {...rest}
        />
      </div>
      <span className='switch-error capitalize-first-letter'>
        {redInfo?.(!!value)}
      </span>
    </div>
  )
}

export default FormSwitch

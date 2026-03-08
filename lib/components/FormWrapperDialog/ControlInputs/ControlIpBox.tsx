import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { EMPTY_STRING, FORM_VALIDATIONS } from 'consts'

import IpTextBox from '../../inputs/IpTextBox'

interface ControlIpBoxProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: string
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlIpBox({
  control,
  name,
  defaultValue = EMPTY_STRING,
  rules = {},
  ...rest
}: ControlIpBoxProps) {
  const { disabled } = rest
  const isRequiredInRules = Object.values(rules).includes(
    FORM_VALIDATIONS.REQUIRED
  )
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      isClearable
      name={name}
      rules={rules}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <IpTextBox
            {...rest}
            disabled={disabled}
            error={error?.message}
            isRequired={isRequiredInRules ? !disabled : null}
            onChange={field.onChange}
            value={field.value}
          />
        </div>
      )}
    />
  )
}

export default ControlIpBox

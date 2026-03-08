import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { FORM_VALIDATIONS } from 'consts'

import TextBox from '../../inputs/TextBox'

interface ControlTextBoxProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: string | number
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlTextBox({
  control,
  name,
  defaultValue,
  rules = {},
  ...rest
}: ControlTextBoxProps) {
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
          <TextBox
            {...rest}
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

export default ControlTextBox

import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { FORM_VALIDATIONS } from '#consts'

import TextBox from '../../inputs/TextBox'

type ControlTextBoxProps = Omit<
  ComponentProps<typeof TextBox>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control
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
      name={name}
      rules={rules}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <TextBox
            {...rest}
            error={error?.message}
            isRequired={isRequiredInRules ? !disabled : undefined}
            onChange={field.onChange}
            value={field.value}
          />
        </div>
      )}
    />
  )
}

export default ControlTextBox

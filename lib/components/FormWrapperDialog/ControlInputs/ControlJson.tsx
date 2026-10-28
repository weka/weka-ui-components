import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { FORM_VALIDATIONS } from '#consts'

import JsonBox from '../../inputs/JsonBox'

type ControlJsonProps = Omit<
  ComponentProps<typeof JsonBox>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control
  name: string
  defaultValue?: string
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlJson({
  control,
  name,
  defaultValue,
  rules = {},
  ...rest
}: ControlJsonProps) {
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
        <div className='field-container control-json'>
          <JsonBox
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

export default ControlJson

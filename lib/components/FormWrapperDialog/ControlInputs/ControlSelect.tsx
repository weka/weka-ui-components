import React from 'react'
import { Controller, Control } from 'react-hook-form'
import Select from '../../inputs/Select'
import { EMPTY_STRING, FORM_VALIDATIONS } from 'consts'

interface ControlSelectProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: string | number | string[]
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlSelect(props: ControlSelectProps) {
  const {
    control,
    name,
    defaultValue = EMPTY_STRING,
    rules = {},
    ...rest
  } = props
  const { disabled } = rest
  const isRequiredInRules = Object.values(rules).includes(
    FORM_VALIDATIONS.REQUIRED
  )

  return (
    <Controller
      name={name}
      isClearable
      rules={rules}
      defaultValue={defaultValue}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <Select
            {...rest}
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
            isRequired={isRequiredInRules && !disabled}
          />
        </div>
      )}
    />
  )
}

export default ControlSelect

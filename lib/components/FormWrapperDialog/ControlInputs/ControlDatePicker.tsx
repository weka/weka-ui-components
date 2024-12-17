import React from 'react'
import { Controller, Control } from 'react-hook-form'
import { DateTime } from 'luxon'
import DateTimePicker from '../../DateTimePicker'
import { FORM_VALIDATIONS } from 'consts'

interface ControlDatePickerProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue: string
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlDatePicker(props: ControlDatePickerProps) {
  const { control, name, defaultValue, rules = {}, ...rest } = props
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
      render={({ field, fieldState: { error } }) => {
        const formattedValue = field.value
          ? DateTime.fromISO(field.value)
          : undefined
        return (
          <div className='field-container'>
            <DateTimePicker
              {...rest}
              onChange={(date) => field.onChange(date ? date.toISO() : null)}
              value={formattedValue}
              error={error?.message}
              isRequired={isRequiredInRules && !disabled}
            />
          </div>
        )
      }}
    />
  )
}

export default ControlDatePicker

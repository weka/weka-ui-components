import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { DateTime } from 'luxon'

import { FORM_VALIDATIONS } from 'consts'

import DateTimePicker from '../../DateTimePicker'

interface ControlDatePickerProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue: string
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlDatePicker({
  control,
  name,
  defaultValue,
  rules = {},
  ...rest
}: ControlDatePickerProps) {
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
      render={({ field, fieldState: { error } }) => {
        const formattedValue = field.value
          ? DateTime.fromISO(field.value)
          : undefined
        return (
          <div className='field-container'>
            <DateTimePicker
              {...rest}
              error={error?.message}
              isRequired={isRequiredInRules ? !disabled : null}
              onChange={(date) => field.onChange(date ? date.toISO() : null)}
              value={formattedValue}
            />
          </div>
        )
      }}
    />
  )
}

export default ControlDatePicker

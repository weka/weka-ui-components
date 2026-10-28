import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import { DateTime } from 'luxon'

import { FORM_VALIDATIONS } from '#consts'

import DateTimePicker from '../../DateTimePicker'

type ControlDatePickerProps = Omit<
  ComponentProps<typeof DateTimePicker>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control
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
              isRequired={isRequiredInRules ? !disabled : undefined}
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

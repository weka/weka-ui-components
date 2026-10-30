import type { ComponentProps } from 'react'
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue
} from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { EMPTY_STRING, FORM_VALIDATIONS } from '#consts'

import Select from '../../inputs/Select'

type ControlSelectProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  ComponentProps<typeof Select>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  defaultValue?: string | number | string[]
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlSelect<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue = EMPTY_STRING,
  rules = {},
  ...rest
}: ControlSelectProps<TFieldValues>) {
  const { disabled } = rest
  const isRequiredInRules = Object.values(rules).includes(
    FORM_VALIDATIONS.REQUIRED
  )

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister
      defaultValue={
        defaultValue as PathValue<TFieldValues, FieldPath<TFieldValues>>
      }
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <Select
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

export default ControlSelect

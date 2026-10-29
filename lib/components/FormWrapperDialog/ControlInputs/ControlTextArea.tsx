import type { ComponentProps } from 'react'
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue
} from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { FORM_VALIDATIONS } from '#consts'

import TextArea from '../../inputs/TextArea'

type ControlTextAreaProps<TFieldValues extends FieldValues = FieldValues> =
  Omit<
    ComponentProps<typeof TextArea>,
    'onChange' | 'value' | 'error' | 'isRequired'
  > & {
    control: Control<TFieldValues>
    name: FieldPath<TFieldValues>
    defaultValue?: string
    rules?: Record<string, unknown>
    disabled?: boolean
  }

function ControlTextArea<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue,
  rules = {},
  ...rest
}: ControlTextAreaProps<TFieldValues>) {
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
          <TextArea
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

export default ControlTextArea

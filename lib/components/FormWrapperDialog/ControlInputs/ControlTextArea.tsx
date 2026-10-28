import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import { FORM_VALIDATIONS } from '#consts'

import TextArea from '../../inputs/TextArea'

type ControlTextAreaProps = Omit<
  ComponentProps<typeof TextArea>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control
  name: string
  defaultValue?: string
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlTextArea({
  control,
  name,
  defaultValue,
  rules = {},
  ...rest
}: ControlTextAreaProps) {
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

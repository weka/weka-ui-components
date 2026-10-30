import type { ComponentProps } from 'react'
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue
} from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import clsx from 'clsx'

import { EMPTY_STRING } from '#consts'

import FormSwitch from '../../inputs/FormSwitch'

// FormSwitchProps has an index signature, which makes Omit drop its named props
type ControlSwitchProps<TFieldValues extends FieldValues = FieldValues> = Pick<
  ComponentProps<typeof FormSwitch>,
  'label' | 'info' | 'oneColor' | 'disabled' | 'placeholder' | 'redInfo'
> & {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  defaultValue?: boolean
  rules?: Record<string, unknown>
  onChange?: (value: boolean) => void
  extraClass?: string
}

function ControlSwitch<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue = false,
  rules = {},
  onChange,
  extraClass = EMPTY_STRING,
  ...rest
}: ControlSwitchProps<TFieldValues>) {
  const cls = clsx({
    'field-container': true,
    [extraClass]: true
  })
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
        <div className={cls}>
          <FormSwitch
            {...rest}
            error={error?.message}
            value={field.value}
            onChange={(event) => {
              onChange?.(event.target.checked)
              field.onChange(event)
            }}
          />
        </div>
      )}
    />
  )
}

export default ControlSwitch

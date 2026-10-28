import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import clsx from 'clsx'

import { EMPTY_STRING } from '#consts'

import FormSwitch from '../../inputs/FormSwitch'

// FormSwitchProps has an index signature, which makes Omit drop its named props
type ControlSwitchProps = Pick<
  ComponentProps<typeof FormSwitch>,
  'label' | 'info' | 'oneColor' | 'disabled' | 'placeholder' | 'redInfo'
> & {
  control: Control
  name: string
  defaultValue?: boolean
  rules?: Record<string, unknown>
  onChange?: (value: boolean) => void
  extraClass?: string
}

function ControlSwitch({
  control,
  name,
  defaultValue = false,
  rules = {},
  onChange,
  extraClass = EMPTY_STRING,
  ...rest
}: ControlSwitchProps) {
  const cls = clsx({
    'field-container': true,
    [extraClass]: true
  })
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      rules={rules}
      shouldUnregister
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

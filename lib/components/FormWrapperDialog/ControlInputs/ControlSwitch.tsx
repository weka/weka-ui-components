import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'

import FormSwitch from '../../inputs/FormSwitch'

interface ControlSwitchProps {
  control: Control<Record<string, unknown>[]>
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
      isClearable
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

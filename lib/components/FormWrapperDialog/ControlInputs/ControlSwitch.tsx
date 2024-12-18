import React from 'react'
import { Controller, Control } from 'react-hook-form'
import clsx from 'clsx'
import FormSwitch from '../../inputs/FormSwitch'
import { EMPTY_STRING } from 'consts'

interface ControlSwitchProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: boolean
  rules?: Record<string, unknown>
  onChange?: (value: boolean) => void
  extraClass?: string
}

function ControlSwitch(props: ControlSwitchProps) {
  const {
    control,
    name,
    defaultValue = false,
    rules = {},
    onChange,
    extraClass = EMPTY_STRING,
    ...rest
  } = props
  const cls = clsx({
    'field-container': true,
    [extraClass]: true
  })
  return (
    <Controller
      name={name}
      isClearable
      rules={rules}
      defaultValue={defaultValue}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className={cls}>
          <FormSwitch
            {...rest}
            onChange={(event) => {
              onChange?.(event.target.checked)
              field.onChange(event)
            }}
            value={field.value}
            error={error?.message}
          />
        </div>
      )}
    />
  )
}

export default ControlSwitch

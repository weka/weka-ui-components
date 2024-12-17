import React from 'react'
import { Controller, Control } from 'react-hook-form'
import ToggleButton from '../../ToggleButton'

interface ControlToggleProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: boolean
}

function ControlToggle({
  control,
  name,
  defaultValue = false,
  ...rest
}: ControlToggleProps) {
  return (
    <Controller
      name={name}
      isClearable
      defaultValue={defaultValue}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <ToggleButton
            {...rest}
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
          />
        </div>
      )}
    />
  )
}

export default ControlToggle

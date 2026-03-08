import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

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
      control={control}
      defaultValue={defaultValue}
      isClearable
      name={name}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <ToggleButton
            {...rest}
            error={error?.message}
            onChange={field.onChange}
            value={field.value}
          />
        </div>
      )}
    />
  )
}

export default ControlToggle

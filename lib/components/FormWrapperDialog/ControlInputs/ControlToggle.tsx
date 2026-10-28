import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import ToggleButton from '../../ToggleButton'

type ControlToggleProps = Omit<
  ComponentProps<typeof ToggleButton>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control
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
      name={name}
      shouldUnregister
      render={({ field }) => (
        <div className='field-container'>
          <ToggleButton
            {...rest}
            onChange={field.onChange}
            value={field.value}
          />
        </div>
      )}
    />
  )
}

export default ControlToggle

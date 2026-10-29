import type { ComponentProps } from 'react'
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue
} from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import ToggleButton from '../../ToggleButton'

type ControlToggleProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  ComponentProps<typeof ToggleButton>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  defaultValue?: boolean
}

function ControlToggle<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue = false,
  ...rest
}: ControlToggleProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister
      defaultValue={
        defaultValue as PathValue<TFieldValues, FieldPath<TFieldValues>>
      }
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

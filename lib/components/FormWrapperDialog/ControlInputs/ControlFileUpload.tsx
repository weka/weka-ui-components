import type { ComponentProps } from 'react'
import type {
  Control,
  FieldPath,
  FieldValues
} from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import utils from '#utils'

import UploadField from '../../inputs/UploadField'

type ControlFileUploadProps<TFieldValues extends FieldValues = FieldValues> =
  Omit<
    ComponentProps<typeof UploadField>,
    'onChange' | 'value' | 'error' | 'isRequired' | 'onReadError'
  > & {
    control: Control<TFieldValues>
    name: FieldPath<TFieldValues>
    rules?: Record<string, unknown>
  }

function ControlFileUpload<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  rules = {},
  ...rest
}: ControlFileUploadProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <UploadField
            {...rest}
            error={error?.message}
            onChange={field.onChange}
            onReadError={() => utils.toastError('Failed to read file')}
          />
        </div>
      )}
    />
  )
}

export default ControlFileUpload

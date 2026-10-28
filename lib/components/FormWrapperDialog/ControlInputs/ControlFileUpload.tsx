import type { ComponentProps } from 'react'
import type { Control } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'

import utils from '#utils'

import UploadField from '../../inputs/UploadField'

type ControlFileUploadProps = Omit<
  ComponentProps<typeof UploadField>,
  'onChange' | 'value' | 'error' | 'isRequired'
> & {
  control: Control
  name: string
  rules?: Record<string, unknown>
}

function ControlFileUpload({
  control,
  name,
  rules = {},
  ...rest
}: ControlFileUploadProps) {
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

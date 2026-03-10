import React from 'react'
import { Controller } from 'react-hook-form'

import utils from 'utils'

import UploadField from '../../inputs/UploadField'

interface ControlFileUploadProps {
  control: Record<string, unknown>
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
      isClearable
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

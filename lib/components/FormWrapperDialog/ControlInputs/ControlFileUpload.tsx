import React from 'react'
import { Controller } from 'react-hook-form'
import UploadField from '../../inputs/UploadField'
import utils from 'utils'

interface ControlFileUploadProps {
  control: Record<string, unknown>
  name: string
  rules?: Record<string, unknown>
}

function ControlFileUpload(props: ControlFileUploadProps) {
  const { control, name, rules = {}, ...rest } = props
  return (
    <Controller
      name={name}
      isClearable
      rules={rules}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <UploadField
            {...rest}
            onReadError={() => utils.toastError('Failed to read file')}
            onChange={field.onChange}
            error={error?.message}
          />
        </div>
      )}
    />
  )
}

export default ControlFileUpload

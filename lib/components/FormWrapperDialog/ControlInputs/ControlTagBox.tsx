import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { FORM_VALIDATIONS } from 'consts'

import TagsBox from '../../inputs/TagsBox'

interface ControlTagsBoxProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: string[]
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlTagsBox({
  control,
  name,
  defaultValue = [],
  rules = {},
  ...rest
}: ControlTagsBoxProps) {
  const { disabled } = rest
  const isRequiredInRules = Object.values(rules).includes(
    FORM_VALIDATIONS.REQUIRED
  )
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      isClearable
      name={name}
      rules={rules}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <TagsBox
            {...rest}
            error={error?.message}
            isRequired={isRequiredInRules ? !disabled : null}
            onChange={field.onChange}
            value={field.value}
          />
        </div>
      )}
    />
  )
}

export default ControlTagsBox

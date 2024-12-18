import React from 'react'
import { Controller, Control } from 'react-hook-form'
import TagsBox from '../../inputs/TagsBox'
import { FORM_VALIDATIONS } from 'consts'

interface ControlTagsBoxProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: string[]
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlTagsBox(props: ControlTagsBoxProps) {
  const { control, name, defaultValue = [], rules = {}, ...rest } = props
  const { disabled } = rest
  const isRequiredInRules = Object.values(rules).includes(
    FORM_VALIDATIONS.REQUIRED
  )
  return (
    <Controller
      name={name}
      isClearable
      rules={rules}
      defaultValue={defaultValue}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <div className='field-container'>
          <TagsBox
            {...rest}
            onChange={field.onChange}
            value={field.value}
            error={error?.message}
            isRequired={isRequiredInRules && !disabled}
          />
        </div>
      )}
    />
  )
}

export default ControlTagsBox

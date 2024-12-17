import React from 'react'
import { Control, Controller } from 'react-hook-form'
import TextBox from '../../inputs/TextBox'
import { FORM_VALIDATIONS } from 'consts'

interface ControlTextBoxProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: string | number
  rules?: Record<string, unknown>
  disabled?: boolean
}

function ControlTextBox(props: ControlTextBoxProps) {
  const { control, name, defaultValue, rules = {}, ...rest } = props
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
          <TextBox
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

export default ControlTextBox

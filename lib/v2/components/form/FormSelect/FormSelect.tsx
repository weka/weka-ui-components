import type { SelectOption } from '../../inputs/Select'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { Select } from '../../inputs/Select'
import { FieldWrapper } from '../FieldWrapper'

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  options: SelectOption[]
  label?: string
  info?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  multiple?: boolean
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  options,
  label,
  info,
  placeholder,
  disabled,
  required,
  multiple
}: Readonly<FormSelectProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper
          error={fieldState.error?.message}
          info={info}
          label={label}
          required={required}
        >
          <Select
            disabled={disabled}
            multiple={multiple}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
            required={required}
            value={field.value as string | string[]}
          />
        </FieldWrapper>
      )}
    />
  )
}

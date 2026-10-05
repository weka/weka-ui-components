import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

import { IpInput } from '../../inputs/IpInput'
import { FieldWrapper } from '../FieldWrapper'

export interface FormIpInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  label?: string
  info?: string
  disabled?: boolean
  required?: boolean
}

export function FormIpInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  label,
  info,
  disabled,
  required
}: Readonly<FormIpInputProps<TFieldValues, TName>>) {
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
          <IpInput
            disabled={disabled}
            onChange={field.onChange}
            required={required}
            value={(field.value as string) ?? EMPTY_STRING}
          />
        </FieldWrapper>
      )}
    />
  )
}

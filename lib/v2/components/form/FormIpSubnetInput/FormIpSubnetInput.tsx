import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useFieldLabelId } from '#v2/hooks'
import { EMPTY_STRING } from '#v2/utils/consts'

import { IpSubnetInput } from '../../inputs/IpSubnetInput'
import { FieldWrapper } from '../FieldWrapper'

export interface FormIpSubnetInputProps<
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

export function FormIpSubnetInput<
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
}: Readonly<FormIpSubnetInputProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control
  const labelId = useFieldLabelId(label)
  const errorId = useId()

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper
          error={fieldState.error?.message}
          errorId={errorId}
          info={info}
          label={label}
          labelId={labelId}
          required={required}
        >
          <IpSubnetInput
            ariaDescribedBy={fieldState.error?.message ? errorId : undefined}
            ariaLabelledBy={labelId}
            disabled={disabled}
            invalid={Boolean(fieldState.error)}
            onChange={field.onChange}
            required={required}
            value={(field.value as string) ?? EMPTY_STRING}
          />
        </FieldWrapper>
      )}
    />
  )
}

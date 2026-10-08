import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

import { PasswordInput } from '../../inputs/PasswordInput'
import { FieldWrapper } from '../FieldWrapper'

export interface FormPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  label?: string
  info?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  showRules?: boolean
  autoFocus?: boolean
}

export function FormPassword<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  label,
  info,
  placeholder,
  disabled,
  required,
  showRules,
  autoFocus
}: Readonly<FormPasswordProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control
  const fieldId = useId()

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper
          error={fieldState.error?.message}
          htmlFor={fieldId}
          info={info}
          label={label}
          required={required}
        >
          <PasswordInput
            ref={field.ref}
            autoFocus={autoFocus}
            disabled={disabled}
            id={fieldId}
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            placeholder={placeholder}
            required={required}
            showRules={showRules}
            value={(field.value as string) ?? EMPTY_STRING}
          />
        </FieldWrapper>
      )}
    />
  )
}

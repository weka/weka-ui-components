import type { TextInputType } from '../../inputs/TextInput'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

import { TextInput } from '../../inputs/TextInput'
import { FieldWrapper } from '../FieldWrapper'

export interface FormTextInputProps<
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
  type?: TextInputType
  autoFocus?: boolean
  /** Overrides the default label styling entirely (e.g. a small-caps section-label look) instead of merging with it. */
  labelClassName?: string
  /** Merged onto the underlying input, e.g. to cap its width for a mockup-sized field. */
  extraClass?: string
}

export function FormTextInput<
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
  type,
  autoFocus,
  labelClassName,
  extraClass
}: Readonly<FormTextInputProps<TFieldValues, TName>>) {
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
          labelClassName={labelClassName}
          required={required}
        >
          <TextInput
            ref={field.ref}
            autoFocus={autoFocus}
            disabled={disabled}
            extraClass={extraClass}
            id={fieldId}
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            placeholder={placeholder}
            required={required}
            type={type}
            value={(field.value as string | undefined) ?? EMPTY_STRING}
          />
        </FieldWrapper>
      )}
    />
  )
}

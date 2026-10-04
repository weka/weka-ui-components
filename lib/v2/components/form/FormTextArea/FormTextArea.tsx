import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FieldWrapper } from '../FieldWrapper'

import styles from './formTextArea.module.scss'

export interface FormTextAreaProps<
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
  autoFocus?: boolean
}

export function FormTextArea<
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
  autoFocus
}: Readonly<FormTextAreaProps<TFieldValues, TName>>) {
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
          <textarea
            autoFocus={autoFocus}
            className={styles.textarea}
            disabled={disabled}
            id={fieldId}
            placeholder={placeholder}
            value={(field.value as string) ?? EMPTY_STRING}
            onChange={(e) => {
              field.onChange(e.target.value)
            }}
          />
        </FieldWrapper>
      )}
    />
  )
}

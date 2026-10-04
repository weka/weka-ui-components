import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

import { NumberInput } from '../../inputs/NumberInput'
import { FieldWrapper } from '../FieldWrapper'

export interface FormNumberInputProps<
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
  min?: number
  max?: number
  step?: number
  /** Overrides the default label styling entirely (e.g. a small-caps section-label look) instead of merging with it. */
  labelClassName?: string
  /** Merged onto the underlying input, e.g. to cap its width for a mockup-sized field. */
  extraClass?: string
  showArrows?: boolean
}

export function FormNumberInput<
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
  min,
  max,
  step,
  labelClassName,
  extraClass,
  showArrows
}: Readonly<FormNumberInputProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control
  const fieldId = useId()

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const handleChange = (rawValue: string) => {
          field.onChange(
            rawValue === EMPTY_STRING ? undefined : Number(rawValue)
          )
        }

        return (
          <FieldWrapper
            error={fieldState.error?.message}
            htmlFor={fieldId}
            info={info}
            label={label}
            labelClassName={labelClassName}
            required={required}
          >
            <NumberInput
              disabled={disabled}
              extraClass={extraClass}
              id={fieldId}
              max={max}
              min={min}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              showArrows={showArrows}
              step={step}
              value={(field.value ?? EMPTY_STRING) as string | number}
            />
          </FieldWrapper>
        )
      }}
    />
  )
}

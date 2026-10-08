import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { useFieldLabelId } from '#v2/hooks'
import { EMPTY_STRING } from '#v2/utils/consts'

import { IpRangeInput } from '../../inputs/IpRangeInput'
import { FieldWrapper } from '../FieldWrapper'

export interface FormIpRangeInputProps<
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
  /** Visible label above the start address, forwarded to IpRangeInput. */
  startLabel?: string
  /** Visible label above the end address, forwarded to IpRangeInput. */
  endLabel?: string
}

export function FormIpRangeInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  label,
  info,
  disabled,
  required,
  startLabel,
  endLabel
}: Readonly<FormIpRangeInputProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control
  const labelId = useFieldLabelId(label)

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
          labelId={labelId}
          required={required}
        >
          <IpRangeInput
            ariaLabelledBy={labelId}
            disabled={disabled}
            endLabel={endLabel}
            onChange={field.onChange}
            required={required}
            startLabel={startLabel}
            value={(field.value as string) ?? EMPTY_STRING}
          />
        </FieldWrapper>
      )}
    />
  )
}

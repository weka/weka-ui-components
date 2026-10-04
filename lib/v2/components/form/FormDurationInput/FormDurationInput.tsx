import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useMemo } from 'react'

import {
  resolveDefaultUnit,
  toShortUnitOptions
} from '#v2/utils/unitOptionUtils'

import { FormCapacityInput } from '../FormCapacityInput'
import {
  DURATION_UNIT_OPTIONS,
  type DurationUnitOption
} from './durationUnitOptions'

export interface DurationValue {
  number: number | undefined
  unit: {
    label: string | undefined
    value: number | undefined
  }
}

const DEFAULT_DURATION_UNIT_LABELS = ['Min']

export interface FormDurationInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  label?: string
  required?: boolean
  disabled?: boolean
  /** Defaults to {@link DURATION_UNIT_OPTIONS}. */
  unitOptions?: DurationUnitOption[]
}

export function FormDurationInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  label,
  required,
  disabled,
  unitOptions = DURATION_UNIT_OPTIONS
}: Readonly<FormDurationInputProps<TFieldValues, TName>>) {
  const shortUnitOptions = useMemo(
    () => toShortUnitOptions(unitOptions),
    [unitOptions]
  )
  const defaultUnit = useMemo(
    () => resolveDefaultUnit(shortUnitOptions, DEFAULT_DURATION_UNIT_LABELS),
    [shortUnitOptions]
  )

  return (
    <FormCapacityInput<TFieldValues, TName>
      control={control}
      defaultUnit={defaultUnit}
      disabled={disabled}
      label={label}
      name={name}
      required={required}
      rules={rules}
      unitOptions={shortUnitOptions}
    />
  )
}

import type {
  CardRadioGroupOrientation,
  CardRadioOption
} from '../../CardRadioGroup'
import type { RadioValue } from '../../inputs/RadioGroup'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { CardRadioGroup } from '../../CardRadioGroup'
import { FieldWrapper } from '../FieldWrapper'

import styles from './formCardRadioGroup.module.scss'

export interface FormCardRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  options: CardRadioOption[]
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  disabled?: boolean
  label?: string
  /** Overrides the default label styling entirely (e.g. a small-caps section-label look) instead of merging with it. */
  labelClassName?: string
  /** `horizontal` (default) or `vertical` — forwarded to the underlying v2 `CardRadioGroup`. */
  orientation?: CardRadioGroupOrientation
  /** Forwarded to the underlying v2 `CardRadioGroup` for a group with no visible `label`. */
  ariaLabel?: string
}

export function FormCardRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  options,
  control,
  rules,
  disabled,
  label,
  labelClassName,
  orientation,
  ariaLabel
}: Readonly<FormCardRadioGroupProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper error={fieldState.error?.message}>
          {label ? (
            <span className={labelClassName ?? styles.fieldLabel}>{label}</span>
          ) : null}
          <CardRadioGroup
            ariaLabel={ariaLabel}
            disabled={disabled}
            onChange={field.onChange}
            options={options}
            orientation={orientation}
            value={field.value as RadioValue}
          />
        </FieldWrapper>
      )}
    />
  )
}

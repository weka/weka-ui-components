import type {
  RadioGroupDirection,
  RadioOption,
  RadioValue
} from '../../inputs/RadioGroup'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { RadioGroup } from '../../inputs/RadioGroup'
import { FieldWrapper } from '../FieldWrapper'

import styles from './formRadioGroup.module.scss'

export interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  options: RadioOption<RadioValue>[]
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  direction?: RadioGroupDirection
  disabled?: boolean
  label?: string
  wrapperClass?: string
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  options,
  control,
  rules,
  direction,
  disabled,
  label,
  wrapperClass
}: Readonly<FormRadioGroupProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper error={fieldState.error?.message}>
          {label ? <span className={styles.fieldLabel}>{label}</span> : null}
          <RadioGroup
            direction={direction}
            disabled={disabled}
            onChange={field.onChange}
            options={options}
            value={field.value as RadioValue}
            wrapperClass={wrapperClass}
          />
        </FieldWrapper>
      )}
    />
  )
}

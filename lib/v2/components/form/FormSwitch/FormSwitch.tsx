import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'
import clsx from 'clsx'

import { Switch } from '../../Switch'
import { FieldWrapper } from '../FieldWrapper'

import styles from './formSwitch.module.scss'

export interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  disabled?: boolean
  tooltip?: string
  label?: string
  labelFirst?: boolean
  required?: boolean
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  disabled,
  tooltip,
  label,
  labelFirst,
  required
}: Readonly<FormSwitchProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper error={fieldState.error?.message}>
          <div
            className={clsx(
              styles.switchRow,
              labelFirst && styles.switchRowLabelFirst
            )}
          >
            <Switch
              checked={Boolean(field.value)}
              disabled={disabled}
              tooltip={tooltip}
              onChange={(_e, checked) => {
                field.onChange(checked)
              }}
            />
            {label ? (
              <span className={styles.switchLabel}>
                {label}
                {required ? (
                  <span className={styles.required}>&thinsp;*</span>
                ) : null}
              </span>
            ) : null}
          </div>
        </FieldWrapper>
      )}
    />
  )
}

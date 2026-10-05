import type {
  CapacityAmountUnitOption,
  CapacityAmountValue
} from '../../inputs/CapacityAmountInput'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useId, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import clsx from 'clsx'

import {
  DEFAULT_CAPACITY_UNIT_LABELS,
  resolveAdoptedUnit,
  resolveDefaultUnit,
  toShortUnitOptions
} from '#v2/utils/unitOptionUtils'

import { CapacityAmountInput } from '../../inputs/CapacityAmountInput'
import { FieldWrapper } from '../FieldWrapper'
import { withCapacityRequired } from './formCapacityInput.utils'

import styles from './formCapacityInput.module.scss'

export type CapacityUnitOption = CapacityAmountUnitOption

export type CapacityValue = CapacityAmountValue

export interface FormCapacityInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  label?: string
  info?: string
  required?: boolean
  disabled?: boolean
  unitOptions: CapacityUnitOption[]
  /**
   * Unit shown (and adopted once a number is typed) while the field value
   * carries no unit, so the dropdown never renders empty. Defaults to the
   * GB/GiB option when one exists, else the first option.
   */
  defaultUnit?: CapacityUnitOption
  allowDecimal?: boolean
  placeholder?: string
  hideUnitSelect?: boolean
  showArrows?: boolean
}

export function FormCapacityInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  label,
  info,
  required,
  disabled,
  unitOptions,
  defaultUnit,
  allowDecimal,
  placeholder,
  hideUnitSelect,
  showArrows
}: Readonly<FormCapacityInputProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control
  const fieldId = useId()
  const resolvedRules = useMemo(() => withCapacityRequired(rules), [rules])

  const shortUnitOptions = toShortUnitOptions(unitOptions)
  const effectiveDefaultUnit =
    defaultUnit ??
    resolveDefaultUnit(shortUnitOptions, DEFAULT_CAPACITY_UNIT_LABELS)

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={resolvedRules}
      render={({ field, fieldState }) => {
        const currentValue = field.value as CapacityValue | undefined
        const displayValue: CapacityValue = {
          number: currentValue?.number,
          unit: resolveAdoptedUnit(currentValue?.unit, effectiveDefaultUnit)
        }

        return (
          <FieldWrapper
            error={fieldState.error?.message}
            htmlFor={fieldId}
            info={info}
            label={label}
            required={required}
          >
            <div
              className={clsx(
                styles.capacityRow,
                hideUnitSelect && styles.numberOnlyRow
              )}
            >
              <CapacityAmountInput
                allowDecimal={allowDecimal}
                disabled={disabled}
                hideUnitSelect={hideUnitSelect}
                id={fieldId}
                numberFieldClassName={styles.numberPart}
                onChange={field.onChange}
                placeholder={placeholder}
                showArrows={showArrows}
                unitFieldClassName={styles.unitPart}
                unitOptions={shortUnitOptions}
                value={displayValue}
              />
            </div>
          </FieldWrapper>
        )
      }}
    />
  )
}

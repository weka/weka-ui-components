import type { ReactNode } from 'react'
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { ToggleSection } from '../../ToggleSection'

export interface FormToggleSectionProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  label: string
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  disabled?: boolean
  labelTooltip?: string
  switchTooltip?: string
  children?: ReactNode
  contentClass?: string
  showDivider?: boolean
  dataTestId?: string
}

export function FormToggleSection<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  control,
  rules,
  disabled,
  labelTooltip,
  switchTooltip,
  children,
  contentClass,
  showDivider,
  dataTestId
}: Readonly<FormToggleSectionProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field }) => (
        <ToggleSection
          checked={Boolean(field.value)}
          contentClass={contentClass}
          dataTestId={dataTestId}
          disabled={disabled}
          label={label}
          labelTooltip={labelTooltip}
          onChange={field.onChange}
          showDivider={showDivider}
          switchTooltip={switchTooltip}
        >
          {children}
        </ToggleSection>
      )}
    />
  )
}

import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { MultiSelectAutocomplete } from '../../inputs/MultiSelectAutocomplete'
import { FieldWrapper } from '../FieldWrapper'
import { buildFreeEntrySuggestions } from './formMultiSelect.utils'

const FREE_ENTRY_MIN_SEARCH_LENGTH = 1

const EMPTY_OPTIONS: string[] = []

export interface FormMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  options?: string[]
  label?: string
  info?: string
  placeholder?: string
  required?: boolean
  allowNewValues?: boolean
}

export function FormMultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  options = EMPTY_OPTIONS,
  label,
  info,
  placeholder,
  required,
  allowNewValues = false
}: Readonly<FormMultiSelectProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control

  const handleSearch = useCallback(
    (query: string): Promise<string[]> =>
      Promise.resolve(buildFreeEntrySuggestions(options, query)),
    [options]
  )

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
          required={required}
        >
          <MultiSelectAutocomplete
            onChange={field.onChange}
            onSearch={allowNewValues ? handleSearch : undefined}
            options={options}
            placeholder={placeholder}
            required={required}
            value={(field.value as string[] | undefined) ?? EMPTY_OPTIONS}
            minSearchLength={
              allowNewValues ? FREE_ENTRY_MIN_SEARCH_LENGTH : undefined
            }
          />
        </FieldWrapper>
      )}
    />
  )
}

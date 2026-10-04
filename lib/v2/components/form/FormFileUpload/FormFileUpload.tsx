import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FileUpload } from '../../inputs/FileUpload'
import { FieldWrapper } from '../FieldWrapper'

export interface FormFileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues, TName>
  label?: string
  disabled?: boolean
  required?: boolean
  accept?: string
}

export function FormFileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  label,
  disabled,
  required,
  accept
}: Readonly<FormFileUploadProps<TFieldValues, TName>>) {
  const ctx = useFormContext<TFieldValues>()
  const ctrl = control ?? ctx.control
  const [fileName, setFileName] = useState(EMPTY_STRING)

  return (
    <Controller
      control={ctrl}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FieldWrapper error={fieldState.error?.message}>
          <FileUpload
            accept={accept}
            disabled={disabled}
            fileName={fileName}
            label={label}
            required={required}
            onChange={(file) => {
              if (!file) {
                setFileName(EMPTY_STRING)
                field.onChange(EMPTY_STRING)
                return
              }
              setFileName(file.name)
              const reader = new FileReader()
              reader.onload = () => {
                field.onChange(String(reader.result))
              }
              reader.readAsText(file)
            }}
          />
        </FieldWrapper>
      )}
    />
  )
}

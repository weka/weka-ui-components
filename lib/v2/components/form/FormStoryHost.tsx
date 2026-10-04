import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const STORY_WIDTH = 360
const MANUAL_ERROR_TYPE = 'manual'

export interface FormStoryHostProps {
  defaultValues: FieldValues
  errors: Record<string, string>
  children: ReactNode
}

export function FormStoryHost({
  defaultValues,
  errors,
  children
}: Readonly<FormStoryHostProps>) {
  const form = useForm({ defaultValues })
  const { setError } = form

  useEffect(() => {
    Object.entries(errors).forEach(([name, message]) => {
      setError(name, { type: MANUAL_ERROR_TYPE, message })
    })
  }, [errors, setError])

  return (
    <FormProvider {...form}>
      <div style={{ width: STORY_WIDTH }}>{children}</div>
    </FormProvider>
  )
}

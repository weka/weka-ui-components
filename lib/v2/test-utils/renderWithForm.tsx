import type { RenderResult } from '@testing-library/react'
import type { ReactNode } from 'react'
import type {
  DefaultValues,
  FieldValues,
  Mode,
  UseFormReturn
} from 'react-hook-form'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render } from '@testing-library/react'

interface RenderWithFormOptions<TFieldValues extends FieldValues> {
  defaultValues?: DefaultValues<TFieldValues>
  mode?: Mode
}

interface RenderWithFormResult<TFieldValues extends FieldValues>
  extends RenderResult {
  form: UseFormReturn<TFieldValues>
}

/** Test-only: renders `children` inside a `FormProvider` and returns the live form instance. */
export function renderWithForm<TFieldValues extends FieldValues = FieldValues>(
  children: ReactNode,
  { defaultValues, mode }: RenderWithFormOptions<TFieldValues> = {}
): RenderWithFormResult<TFieldValues> {
  let capturedForm: UseFormReturn<TFieldValues> | undefined

  function FormHost() {
    const form = useForm<TFieldValues>({ defaultValues, mode })

    useEffect(() => {
      capturedForm = form
    }, [form])

    return <FormProvider {...form}>{children}</FormProvider>
  }

  const renderResult = render(<FormHost />)

  if (!capturedForm) {
    throw new Error('renderWithForm: form instance was not captured')
  }

  return { ...renderResult, form: capturedForm }
}

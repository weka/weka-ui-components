import type { Decorator } from '@storybook/react'
import type { FieldValues } from 'react-hook-form'

import { FormStoryHost } from './FormStoryHost'

/**
 * Story decorator that supplies a react-hook-form context. `errors` maps field
 * names to messages that are set on mount so error states can be shown.
 */
export function withFormProvider(
  defaultValues: FieldValues = {},
  errors: Record<string, string> = {}
): Decorator {
  return function (Story) {
    return (
      <FormStoryHost
        defaultValues={defaultValues}
        errors={errors}
      >
        <Story />
      </FormStoryHost>
    )
  }
}

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormNumberInput } from './FormNumberInput'

interface HostValues {
  count: number | undefined
}

const COUNT_LABEL = 'Count'
const INITIAL_COUNT = 3
const TYPED_COUNT = 12

function renderNumber(defaultCount?: number) {
  return renderWithForm<HostValues>(
    <FormNumberInput<HostValues>
      label={COUNT_LABEL}
      name='count'
    />,
    { defaultValues: { count: defaultCount } }
  )
}

describe('FormNumberInput', () => {
  it('renders the current form value', () => {
    renderNumber(INITIAL_COUNT)

    expect(screen.getByLabelText(COUNT_LABEL)).toHaveValue(INITIAL_COUNT)
  })

  it('writes a typed number to the form', () => {
    const { form } = renderNumber()

    fireEvent.change(screen.getByLabelText(COUNT_LABEL), {
      target: { value: String(TYPED_COUNT) }
    })

    expect(form.getValues('count')).toBe(TYPED_COUNT)
  })

  it('writes undefined when the field is cleared', () => {
    const { form } = renderNumber(INITIAL_COUNT)

    fireEvent.change(screen.getByLabelText(COUNT_LABEL), {
      target: { value: EMPTY_STRING }
    })

    expect(form.getValues('count')).toBeUndefined()
  })
})

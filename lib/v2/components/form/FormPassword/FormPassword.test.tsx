import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormPassword } from './FormPassword'

interface HostValues {
  secret: string
}

const SECRET_LABEL = 'Secret'
const TYPED_VALUE = 'hunter2'

function renderPassword(disabled?: boolean) {
  return renderWithForm<HostValues>(
    <FormPassword<HostValues>
      disabled={disabled}
      label={SECRET_LABEL}
      name='secret'
    />,
    { defaultValues: { secret: EMPTY_STRING } }
  )
}

describe('FormPassword', () => {
  it('renders its label bound to the input', () => {
    renderPassword()

    expect(screen.getByLabelText(SECRET_LABEL)).toBeInTheDocument()
  })

  it('writes typed text to the form', () => {
    const { form } = renderPassword()

    fireEvent.change(screen.getByLabelText(SECRET_LABEL), {
      target: { value: TYPED_VALUE }
    })

    expect(form.getValues('secret')).toBe(TYPED_VALUE)
  })

  it('disables the input when disabled', () => {
    renderPassword(true)

    expect(screen.getByLabelText(SECRET_LABEL)).toBeDisabled()
  })
})

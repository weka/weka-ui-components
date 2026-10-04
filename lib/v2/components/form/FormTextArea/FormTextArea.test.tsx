import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormTextArea } from './FormTextArea'

interface HostValues {
  pem: string
}

const PEM_LABEL = 'PEM Content'
const TYPED_CONTENT = 'CERT'

function renderTextArea(disabled?: boolean) {
  return renderWithForm<HostValues>(
    <FormTextArea<HostValues>
      disabled={disabled}
      label={PEM_LABEL}
      name='pem'
      required
    />,
    { defaultValues: { pem: EMPTY_STRING } }
  )
}

describe('FormTextArea', () => {
  it('renders its label bound to a textbox', () => {
    renderTextArea()

    expect(screen.getByLabelText(new RegExp(PEM_LABEL))).toBe(
      screen.getByRole('textbox')
    )
  })

  it('accepts typed content and writes it to the form', () => {
    const { form } = renderTextArea()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: TYPED_CONTENT }
    })

    expect(screen.getByRole('textbox')).toHaveValue(TYPED_CONTENT)
    expect(form.getValues('pem')).toBe(TYPED_CONTENT)
  })

  it('disables the textbox when disabled', () => {
    renderTextArea(true)

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('marks the field touched on blur', () => {
    const { form } = renderTextArea()

    fireEvent.blur(screen.getByRole('textbox'))

    expect(form.getFieldState('pem').isTouched).toBe(true)
  })

  it('forwards name and required to the textarea', () => {
    renderTextArea()

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'pem')
    expect(textarea).toBeRequired()
  })
})

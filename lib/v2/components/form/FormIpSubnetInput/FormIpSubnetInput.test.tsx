import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormIpSubnetInput } from './FormIpSubnetInput'

interface HostValues {
  subnet: string
}

const FIELD_LABEL = 'IP subnet'
const FIELD_ERROR = 'Field error'

function renderField(disabled?: boolean) {
  return renderWithForm<HostValues>(
    <FormIpSubnetInput<HostValues>
      disabled={disabled}
      info='Helpful hint'
      label={FIELD_LABEL}
      name='subnet'
      required
    />,
    { defaultValues: { subnet: EMPTY_STRING } }
  )
}

describe('FormIpSubnetInput', () => {
  it('renders the label with a required marker', () => {
    renderField()

    expect(screen.getByText(FIELD_LABEL)).toHaveTextContent('*')
  })

  it('renders numeric inputs for the address parts', () => {
    renderField()

    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0)
  })

  it('disables the inputs when disabled', () => {
    renderField(true)

    screen.getAllByRole('spinbutton').forEach((input) => {
      expect(input).toBeDisabled()
    })
  })

  it('names the input group after the field label', () => {
    renderField()

    expect(
      screen.getByRole('group', { name: new RegExp(FIELD_LABEL) })
    ).toBeInTheDocument()
  })

  it('shows the error styling and message when the field has an error', () => {
    const { form } = renderField()

    act(() => {
      form.setError('subnet', { message: FIELD_ERROR })
    })

    expect(screen.getByText(FIELD_ERROR)).toBeInTheDocument()
    screen.getAllByRole('spinbutton').forEach((input) => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('describes the inputs by the field error message', () => {
    const { form } = renderField()

    expect(screen.getAllByRole('spinbutton')[0]).not.toHaveAttribute(
      'aria-describedby'
    )

    act(() => {
      form.setError('subnet', { message: FIELD_ERROR })
    })

    screen.getAllByRole('spinbutton').forEach((input) => {
      expect(input).toHaveAccessibleDescription(FIELD_ERROR)
    })
  })
})

import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormIpInput } from './FormIpInput'

interface HostValues {
  ip: string
}

const FIELD_LABEL = 'IP address'

function renderField(disabled?: boolean) {
  return renderWithForm<HostValues>(
    <FormIpInput<HostValues>
      disabled={disabled}
      info='Helpful hint'
      label={FIELD_LABEL}
      name='ip'
      required
    />,
    { defaultValues: { ip: EMPTY_STRING } }
  )
}

describe('FormIpInput', () => {
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
})

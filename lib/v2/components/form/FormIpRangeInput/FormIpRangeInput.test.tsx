import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormIpRangeInput } from './FormIpRangeInput'

interface HostValues {
  range: string
}

const FIELD_LABEL = 'IP range'
const START_LABEL = 'From'
const END_LABEL = 'To'

function renderField(disabled?: boolean) {
  return renderWithForm<HostValues>(
    <FormIpRangeInput<HostValues>
      disabled={disabled}
      info='Helpful hint'
      label={FIELD_LABEL}
      name='range'
      required
    />,
    { defaultValues: { range: EMPTY_STRING } }
  )
}

describe('FormIpRangeInput', () => {
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

  it('forwards startLabel and endLabel to the endpoints', () => {
    renderWithForm<HostValues>(
      <FormIpRangeInput<HostValues>
        endLabel={END_LABEL}
        name='range'
        startLabel={START_LABEL}
      />,
      { defaultValues: { range: EMPTY_STRING } }
    )

    expect(screen.getByRole('group', { name: START_LABEL })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: END_LABEL })).toBeInTheDocument()
  })
})

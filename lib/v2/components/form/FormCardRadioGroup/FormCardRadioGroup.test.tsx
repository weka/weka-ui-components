import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormCardRadioGroup } from './FormCardRadioGroup'

interface HostValues {
  plan: string
}

const PLAN_LABEL = 'Plan'
const OPTIONS = [
  { title: 'Basic', value: 'basic' },
  { title: 'Pro', value: 'pro' }
]

describe('FormCardRadioGroup', () => {
  it('renders the field label and the cards', () => {
    renderWithForm<HostValues>(
      <FormCardRadioGroup<HostValues>
        label={PLAN_LABEL}
        name='plan'
        options={OPTIONS}
      />,
      { defaultValues: { plan: 'basic' } }
    )

    expect(screen.getByText(PLAN_LABEL)).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('writes the chosen card to the form', () => {
    const { form } = renderWithForm<HostValues>(
      <FormCardRadioGroup<HostValues>
        name='plan'
        options={OPTIONS}
      />,
      { defaultValues: { plan: 'basic' } }
    )

    fireEvent.click(screen.getByText('Pro'))

    expect(form.getValues('plan')).toBe('pro')
  })

  it('names the radiogroup after the visible label', () => {
    renderWithForm<HostValues>(
      <FormCardRadioGroup<HostValues>
        label={PLAN_LABEL}
        name='plan'
        options={OPTIONS}
      />,
      { defaultValues: { plan: 'basic' } }
    )

    expect(
      screen.getByRole('radiogroup', { name: PLAN_LABEL })
    ).toBeInTheDocument()
  })
})

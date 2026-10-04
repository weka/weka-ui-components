import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormSelect } from './FormSelect'

interface HostValues {
  tier: string
}

const TIER_LABEL = 'Tier'
const OPTIONS = [
  { label: 'Hot', value: 'hot' },
  { label: 'Cold', value: 'cold' }
]

describe('FormSelect', () => {
  it('renders the label and the selected option', () => {
    renderWithForm<HostValues>(
      <FormSelect<HostValues>
        label={TIER_LABEL}
        name='tier'
        options={OPTIONS}
      />,
      { defaultValues: { tier: 'hot' } }
    )

    expect(screen.getByText(TIER_LABEL)).toBeInTheDocument()
    expect(screen.getByText('Hot')).toBeInTheDocument()
  })

  it('writes the chosen option to the form', () => {
    const { form } = renderWithForm<HostValues>(
      <FormSelect<HostValues>
        name='tier'
        options={OPTIONS}
      />,
      { defaultValues: { tier: 'hot' } }
    )

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByTestId('select-option-cold'))

    expect(form.getValues('tier')).toBe('cold')
  })
})

import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormMultiSelect } from './FormMultiSelect'

interface HostValues {
  tags: string[]
}

const TAGS_LABEL = 'Tags'

describe('FormMultiSelect', () => {
  it('renders the label with a required marker', () => {
    renderWithForm<HostValues>(
      <FormMultiSelect<HostValues>
        label={TAGS_LABEL}
        name='tags'
        options={['a', 'b']}
        required
      />,
      { defaultValues: { tags: [] } }
    )

    expect(screen.getByText(TAGS_LABEL)).toHaveTextContent('*')
  })

  it('renders the selected values', () => {
    renderWithForm<HostValues>(
      <FormMultiSelect<HostValues>
        name='tags'
        options={['alpha', 'beta']}
      />,
      { defaultValues: { tags: ['alpha'] } }
    )

    expect(screen.getByText('alpha')).toBeInTheDocument()
  })

  it('names the text input after the field label', () => {
    renderWithForm<HostValues>(
      <FormMultiSelect<HostValues>
        label={TAGS_LABEL}
        name='tags'
        options={['a', 'b']}
      />,
      { defaultValues: { tags: [] } }
    )

    expect(screen.getByLabelText(TAGS_LABEL)).toBe(screen.getByRole('textbox'))
  })
})

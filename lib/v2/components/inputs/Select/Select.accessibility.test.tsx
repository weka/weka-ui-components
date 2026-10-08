import type { SelectOption } from './Select'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './Select'

const SELECT_ID = 'select-id'
const EXTERNAL_LABEL_ID = 'external-label'
const LABEL_TEXT = 'Country'

const options: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
]

describe('Select - Accessible name', () => {
  it('applies id to the combobox', () => {
    render(
      <Select
        id={SELECT_ID}
        onChange={vi.fn()}
        options={options}
      />
    )

    expect(screen.getByRole('combobox')).toHaveAttribute('id', SELECT_ID)
  })

  it('names the combobox from an external label through ariaLabelledBy', () => {
    render(
      <>
        <span id={EXTERNAL_LABEL_ID}>{LABEL_TEXT}</span>
        <Select
          ariaLabelledBy={EXTERNAL_LABEL_ID}
          onChange={vi.fn()}
          options={options}
        />
      </>
    )

    expect(screen.getByLabelText(LABEL_TEXT)).toBe(screen.getByRole('combobox'))
  })
})

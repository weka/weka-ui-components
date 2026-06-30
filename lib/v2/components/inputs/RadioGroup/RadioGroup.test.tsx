import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RadioGroup } from './RadioGroup'

const OPTIONS = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' }
]

describe('RadioGroup', () => {
  it('renders every option and exposes a radiogroup role', () => {
    render(
      <RadioGroup
        onChange={vi.fn()}
        options={OPTIONS}
        value='a'
      />
    )
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(OPTIONS.length)
  })

  it('marks only the selected option as checked', () => {
    render(
      <RadioGroup
        onChange={vi.fn()}
        options={OPTIONS}
        value='b'
      />
    )
    expect(screen.getByTestId('radio-option-b')).toBeChecked()
    expect(screen.getByTestId('radio-option-a')).not.toBeChecked()
  })

  it('calls onChange with the clicked option value', () => {
    const onChange = vi.fn()
    render(
      <RadioGroup
        onChange={onChange}
        options={OPTIONS}
        value='a'
      />
    )
    fireEvent.click(screen.getByTestId('radio-option-c'))
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('does not fire onChange for a disabled option', () => {
    const onChange = vi.fn()
    render(
      <RadioGroup
        onChange={onChange}
        value='a'
        options={[
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b', disabled: true }
        ]}
      />
    )
    fireEvent.click(screen.getByTestId('radio-option-b'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables every option when the group is disabled', () => {
    render(
      <RadioGroup
        disabled
        onChange={vi.fn()}
        options={OPTIONS}
        value='a'
      />
    )
    OPTIONS.forEach((option) =>
      expect(screen.getByTestId(`radio-option-${option.value}`)).toBeDisabled()
    )
  })
})

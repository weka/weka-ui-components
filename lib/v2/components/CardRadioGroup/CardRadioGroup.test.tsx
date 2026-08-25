import type { CardRadioOption } from './CardRadioGroup'

import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CardRadioGroup } from './CardRadioGroup'

const RADIO_ROLE = 'radio'
const ARIA_CHECKED = 'aria-checked'

const OPTIONS: CardRadioOption[] = [
  { value: 'full', title: 'Full', description: 'Copies everything.' },
  { value: 'partial', title: 'Partial', description: 'Copies some paths.' },
  { value: 'none', title: 'None', description: 'Copies nothing.' }
]

interface ControlledCardRadioGroupProps {
  options?: CardRadioOption[]
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  ariaLabel?: string
}

function ControlledCardRadioGroup({
  options = OPTIONS,
  disabled = false,
  orientation,
  ariaLabel
}: Readonly<ControlledCardRadioGroupProps>) {
  const [value, setValue] = useState('full')
  return (
    <CardRadioGroup
      ariaLabel={ariaLabel}
      disabled={disabled}
      onChange={setValue}
      options={options}
      orientation={orientation}
      value={value}
    />
  )
}

describe('CardRadioGroup', () => {
  it('renders every option title and description', () => {
    render(<ControlledCardRadioGroup />)

    expect(screen.getByText('Full')).toBeInTheDocument()
    expect(screen.getByText('Copies everything.')).toBeInTheDocument()
    expect(screen.getByText('Partial')).toBeInTheDocument()
    expect(screen.getByText('Copies some paths.')).toBeInTheDocument()
  })

  it('exposes radiogroup semantics', () => {
    render(<ControlledCardRadioGroup />)

    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getAllByRole(RADIO_ROLE)).toHaveLength(OPTIONS.length)
  })

  it('marks the current value as checked and the others as unchecked', () => {
    render(<ControlledCardRadioGroup />)

    expect(screen.getByRole(RADIO_ROLE, { name: 'Full' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
    expect(screen.getByRole(RADIO_ROLE, { name: 'Partial' })).toHaveAttribute(
      ARIA_CHECKED,
      'false'
    )
  })

  it('selects and focuses a card on click', () => {
    render(<ControlledCardRadioGroup />)

    fireEvent.click(screen.getByRole(RADIO_ROLE, { name: 'Partial' }))

    expect(screen.getByRole(RADIO_ROLE, { name: 'Partial' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
    expect(screen.getByRole(RADIO_ROLE, { name: 'Partial' })).toHaveFocus()
  })

  it('moves selection to the next card with the right arrow key', () => {
    render(<ControlledCardRadioGroup />)

    const fullCard = screen.getByRole(RADIO_ROLE, { name: 'Full' })
    fullCard.focus()
    fireEvent.keyDown(fullCard, { key: 'ArrowRight' })

    expect(screen.getByRole(RADIO_ROLE, { name: 'Partial' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
  })

  it('wraps to the first card when the right arrow is pressed on the last card', () => {
    render(<ControlledCardRadioGroup />)

    fireEvent.click(screen.getByRole(RADIO_ROLE, { name: 'None' }))
    const noneCard = screen.getByRole(RADIO_ROLE, { name: 'None' })
    fireEvent.keyDown(noneCard, { key: 'ArrowRight' })

    expect(screen.getByRole(RADIO_ROLE, { name: 'Full' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
  })

  it('selects the focused card on Space and Enter', () => {
    render(<ControlledCardRadioGroup />)

    const fullCard = screen.getByRole(RADIO_ROLE, { name: 'Full' })
    fullCard.focus()
    fireEvent.keyDown(fullCard, { key: 'Enter' })

    expect(screen.getByRole(RADIO_ROLE, { name: 'Full' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
  })

  it('only makes the selected card tab-reachable', () => {
    render(<ControlledCardRadioGroup />)

    expect(screen.getByRole(RADIO_ROLE, { name: 'Full' })).toHaveAttribute(
      'tabIndex',
      '0'
    )
    expect(screen.getByRole(RADIO_ROLE, { name: 'Partial' })).toHaveAttribute(
      'tabIndex',
      '-1'
    )
  })

  it('ignores clicks when the whole group is disabled', () => {
    render(<ControlledCardRadioGroup disabled />)

    fireEvent.click(screen.getByRole(RADIO_ROLE, { name: 'Partial' }))

    expect(screen.getByRole(RADIO_ROLE, { name: 'Full' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
    expect(screen.getByRole(RADIO_ROLE, { name: 'Partial' })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
  })

  it('ignores clicks on a single option marked disabled while leaving the rest selectable', () => {
    render(
      <ControlledCardRadioGroup
        options={[
          ...OPTIONS.slice(0, 1),
          { ...OPTIONS[1], disabled: true },
          ...OPTIONS.slice(2)
        ]}
      />
    )

    fireEvent.click(screen.getByRole(RADIO_ROLE, { name: 'Partial' }))
    expect(screen.getByRole(RADIO_ROLE, { name: 'Full' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )

    fireEvent.click(screen.getByRole(RADIO_ROLE, { name: 'None' }))
    expect(screen.getByRole(RADIO_ROLE, { name: 'None' })).toHaveAttribute(
      ARIA_CHECKED,
      'true'
    )
  })

  it('renders a note on an option without affecting the others', () => {
    render(
      <ControlledCardRadioGroup
        options={[
          ...OPTIONS,
          {
            value: 'taken',
            title: 'Taken',
            description: 'Already used.',
            note: 'Already replicated'
          }
        ]}
      />
    )

    expect(screen.getByText('Already replicated')).toBeInTheDocument()
  })

  it('calls onChange with the option value', () => {
    const onChange = vi.fn()
    render(
      <CardRadioGroup
        onChange={onChange}
        options={OPTIONS}
        value='full'
      />
    )

    fireEvent.click(screen.getByRole(RADIO_ROLE, { name: 'Partial' }))

    expect(onChange).toHaveBeenCalledWith('partial')
  })

  it('defaults to horizontal orientation, applying no vertical class', () => {
    render(<ControlledCardRadioGroup />)

    expect(screen.getByRole('radiogroup').className).not.toMatch(/vertical/)
  })

  it('applies a vertical layout class when orientation is vertical', () => {
    render(<ControlledCardRadioGroup orientation='vertical' />)

    expect(screen.getByRole('radiogroup').className).toMatch(/vertical/)
  })

  it('exposes the given aria-label on the group when no visible label precedes it', () => {
    render(<ControlledCardRadioGroup ariaLabel='Source filesystem' />)

    expect(
      screen.getByRole('radiogroup', { name: 'Source filesystem' })
    ).toBeInTheDocument()
  })
})

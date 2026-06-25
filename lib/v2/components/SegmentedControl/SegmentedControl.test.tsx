import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SegmentedControl } from './SegmentedControl'

const OPTIONS = [
  { value: '1h', label: '1H' },
  { value: '1d', label: '1D' },
  { value: '7d', label: '7D' }
]
const TEST_ID = 'range'

describe('SegmentedControl', () => {
  it('renders an option button per option', () => {
    render(
      <SegmentedControl
        onChange={vi.fn()}
        options={OPTIONS}
        value='1d'
      />
    )

    expect(screen.getByText('1H')).toBeInTheDocument()
    expect(screen.getByText('1D')).toBeInTheDocument()
    expect(screen.getByText('7D')).toBeInTheDocument()
  })

  it('marks the selected option active', () => {
    render(
      <SegmentedControl
        dataTestId={TEST_ID}
        onChange={vi.fn()}
        options={OPTIONS}
        value='1d'
      />
    )

    expect(screen.getByTestId(`${TEST_ID}-1d`).className).toMatch(/active/)
    expect(screen.getByTestId(`${TEST_ID}-1h`).className).not.toMatch(/active/)
  })

  it('calls onChange with the clicked option value', () => {
    const onChange = vi.fn()
    render(
      <SegmentedControl
        dataTestId={TEST_ID}
        onChange={onChange}
        options={OPTIONS}
        value='1d'
      />
    )

    fireEvent.click(screen.getByTestId(`${TEST_ID}-7d`))

    expect(onChange).toHaveBeenCalledWith('7d')
  })

  it('applies extraClass to the container', () => {
    const EXTRA = 'custom-toggle'
    const { container } = render(
      <SegmentedControl
        extraClass={EXTRA}
        onChange={vi.fn()}
        options={OPTIONS}
        value='1d'
      />
    )

    expect(container.querySelector(`.${EXTRA}`)).toBeInTheDocument()
  })
})

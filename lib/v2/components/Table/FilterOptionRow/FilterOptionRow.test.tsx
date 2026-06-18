import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FilterOptionRow } from './FilterOptionRow'

const OPTION_LABEL = 'us-east-1'
const OPTION_TEST_ID = 'filter-option-region'

afterEach(() => {
  cleanup()
})

describe('FilterOptionRow - rendering', () => {
  it('renders the label', () => {
    render(
      <FilterOptionRow
        isSelected={false}
        label={OPTION_LABEL}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText(OPTION_LABEL)).toBeInTheDocument()
  })

  it('renders a subLabel when provided', () => {
    render(
      <FilterOptionRow
        isSelected={false}
        label={OPTION_LABEL}
        onChange={vi.fn()}
        subLabel='Primary region'
      />
    )
    expect(screen.getByText('Primary region')).toBeInTheDocument()
  })

  it('does not render a subLabel when absent', () => {
    render(
      <FilterOptionRow
        isSelected={false}
        label={OPTION_LABEL}
        onChange={vi.fn()}
      />
    )
    expect(screen.queryByText('Primary region')).not.toBeInTheDocument()
  })

  it('renders a chipElement instead of the label tooltip', () => {
    render(
      <FilterOptionRow
        chipElement={<span data-testid='custom-chip'>chip</span>}
        isSelected={false}
        label={OPTION_LABEL}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByTestId('custom-chip')).toBeInTheDocument()
    expect(screen.queryByText(OPTION_LABEL)).not.toBeInTheDocument()
  })

  it('applies data-testid and data-option-index attributes', () => {
    render(
      <FilterOptionRow
        dataOptionIndex={3}
        dataTestId={OPTION_TEST_ID}
        isSelected={false}
        label={OPTION_LABEL}
        onChange={vi.fn()}
      />
    )
    const row = screen.getByTestId(OPTION_TEST_ID)
    expect(row).toHaveAttribute('data-option-index', '3')
  })
})

describe('FilterOptionRow - selection', () => {
  it('reflects the selected state on the checkbox', () => {
    render(
      <FilterOptionRow
        isSelected
        label={OPTION_LABEL}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles via the checkbox', () => {
    const onChange = vi.fn()
    render(
      <FilterOptionRow
        isSelected={false}
        label={OPTION_LABEL}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('invokes onChange with the current value on row click and stops propagation', () => {
    const onChange = vi.fn()
    const onParentClick = vi.fn()
    render(
      <div onClick={onParentClick}>
        <FilterOptionRow
          dataTestId={OPTION_TEST_ID}
          isSelected
          label={OPTION_LABEL}
          onChange={onChange}
        />
      </div>
    )
    fireEvent.click(screen.getByTestId(OPTION_TEST_ID))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(onParentClick).not.toHaveBeenCalled()
  })
})

describe('FilterOptionRow - disabled', () => {
  it('does not invoke onChange when the checkbox is clicked while disabled', () => {
    const onChange = vi.fn()
    render(
      <FilterOptionRow
        disabled
        isSelected
        label={OPTION_LABEL}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not invoke onChange when the row is clicked while disabled', () => {
    const onChange = vi.fn()
    render(
      <FilterOptionRow
        dataTestId={OPTION_TEST_ID}
        disabled
        isSelected
        label={OPTION_LABEL}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByTestId(OPTION_TEST_ID))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('FilterOptionRow - highlighting', () => {
  it('wraps the matched substring in its own element when highlighting is enabled', () => {
    render(
      <FilterOptionRow
        isSelected={false}
        label='alpha-beta'
        onChange={vi.fn()}
        searchQuery='beta'
        shouldHighlightMatches
      />
    )
    const match = screen.getByText('beta')
    expect(match).toBeInTheDocument()
    expect(match.className).toBeTruthy()
  })

  it('does not split the label when highlighting is disabled', () => {
    render(
      <FilterOptionRow
        isSelected={false}
        label='alpha-beta'
        onChange={vi.fn()}
        searchQuery='beta'
      />
    )
    expect(screen.getByText('alpha-beta')).toBeInTheDocument()
    expect(screen.queryByText('beta')).not.toBeInTheDocument()
  })
})

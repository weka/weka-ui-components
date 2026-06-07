import type { FilterConfig } from '../filterUtils'
import type { CustomFilters } from './filterRegistry'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, FILTER_TYPES } from '#v2/utils/consts'

import { FilterPopover } from './FilterPopover'

const APPLY_BUTTON = 'filter-apply-button'
const REGIONS = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'eu-west-1', label: 'eu-west-1' }
]

function renderPopover(config: FilterConfig, overrides = {}) {
  const props = {
    config,
    value: EMPTY_STRING,
    onValueChange: vi.fn(),
    onClose: vi.fn(),
    anchorElement: null,
    columnName: 'Region',
    columnId: 'region',
    ...overrides
  }
  render(<FilterPopover {...props} />)
  return props
}

afterEach(() => {
  cleanup()
})

describe('FilterPopover - multiselect', () => {
  it('renders options and applies the selected values', () => {
    const { onValueChange, onClose } = renderPopover(
      { type: FILTER_TYPES.MULTISELECT, options: REGIONS },
      { value: [] }
    )
    fireEvent.click(screen.getByTestId('filter-option-us-east-1'))
    fireEvent.click(screen.getByTestId(APPLY_BUTTON))
    expect(onValueChange).toHaveBeenCalledWith(['us-east-1'])
    expect(onClose).toHaveBeenCalled()
  })

  it('clears the filter (undefined) when nothing is selected', () => {
    const { onValueChange } = renderPopover(
      { type: FILTER_TYPES.MULTISELECT, options: REGIONS },
      { value: [] }
    )
    fireEvent.click(screen.getByTestId(APPLY_BUTTON))
    expect(onValueChange).toHaveBeenCalledWith(undefined)
  })

  it('renders a search box when startWithSearch is set', () => {
    renderPopover(
      {
        type: FILTER_TYPES.MULTISELECT,
        options: REGIONS,
        startWithSearch: true
      },
      { value: [] }
    )
    expect(screen.getByTestId('filter-search-input')).toBeInTheDocument()
  })
})

describe('FilterPopover - dropdown', () => {
  it('applies the chosen option', () => {
    const { onValueChange } = renderPopover({
      type: FILTER_TYPES.DROPDOWN,
      options: REGIONS
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'eu-west-1' }
    })
    fireEvent.click(screen.getByTestId(APPLY_BUTTON))
    expect(onValueChange).toHaveBeenCalledWith('eu-west-1')
  })
})

describe('FilterPopover - numeric range', () => {
  it('disables apply when max is smaller than min', () => {
    renderPopover(
      { type: FILTER_TYPES.NUM_RANGE },
      { value: { min: null, max: null } }
    )
    fireEvent.change(screen.getByTestId('number-range-min-input'), {
      target: { value: '10' }
    })
    fireEvent.change(screen.getByTestId('number-range-max-input'), {
      target: { value: '5' }
    })
    expect(screen.getByTestId(APPLY_BUTTON)).toBeDisabled()
  })

  it('refreshes the inputs when the applied value changes externally', () => {
    const minInput = 'number-range-min-input'
    const baseProps = {
      config: { type: FILTER_TYPES.NUM_RANGE },
      onClose: vi.fn(),
      onValueChange: vi.fn(),
      anchorElement: null,
      columnName: 'Size',
      columnId: 'size'
    }
    const { rerender } = render(
      <FilterPopover
        {...baseProps}
        value={{ min: 5, max: null }}
      />
    )
    expect(screen.getByTestId(minInput)).toHaveDisplayValue('5')

    rerender(
      <FilterPopover
        {...baseProps}
        value={{ min: 20, max: null }}
      />
    )
    expect(screen.getByTestId(minInput)).toHaveDisplayValue('20')
  })
})

describe('FilterPopover - custom filter registry', () => {
  const CUSTOM_VALUE = { amount: 5 }
  const customFilters: CustomFilters = {
    [FILTER_TYPES.CAPACITY_RANGE]: {
      getDefaultValue: () => ({ amount: 0 }),
      render: ({ value, onChange }) => (
        <button
          data-testid='stub-set'
          onClick={() => onChange(CUSTOM_VALUE)}
          type='button'
        >
          amount:{(value as { amount: number }).amount}
        </button>
      ),
      isEmpty: (value) => (value as { amount: number }).amount === 0,
      validate: (value) =>
        (value as { amount: number }).amount < 0 ? 'invalid' : EMPTY_STRING
    }
  }

  it('renders the injected custom filter seeded with its default value', () => {
    renderPopover(
      { type: FILTER_TYPES.CAPACITY_RANGE },
      { value: undefined, customFilters }
    )
    expect(screen.getByTestId('stub-set')).toHaveTextContent('amount:0')
  })

  it('applies undefined when the custom value is empty', () => {
    const { onValueChange } = renderPopover(
      { type: FILTER_TYPES.CAPACITY_RANGE },
      { value: undefined, customFilters }
    )
    fireEvent.click(screen.getByTestId(APPLY_BUTTON))
    expect(onValueChange).toHaveBeenCalledWith(undefined)
  })

  it('applies the custom value once it is non-empty', () => {
    const { onValueChange } = renderPopover(
      { type: FILTER_TYPES.CAPACITY_RANGE },
      { value: undefined, customFilters }
    )
    fireEvent.click(screen.getByTestId('stub-set'))
    fireEvent.click(screen.getByTestId(APPLY_BUTTON))
    expect(onValueChange).toHaveBeenCalledWith(CUSTOM_VALUE)
  })
})

describe('FilterPopover - header', () => {
  it('renders the title when provided', () => {
    renderPopover({
      type: FILTER_TYPES.DROPDOWN,
      options: REGIONS,
      title: 'Pick'
    })
    expect(screen.getByText('Pick')).toBeInTheDocument()
  })
})

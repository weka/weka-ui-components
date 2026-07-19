import { fireEvent, render, screen } from '@testing-library/react'
import { DateTime } from 'luxon'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { type CustomTimeRange, TimeRangeSelector } from './TimeRangeSelector'

const SELECTOR_TESTID = 'time-range-selector'
const OPTION_1H_TESTID = 'time-range-option-1h'

const createProps = (overrides = {}) => ({
  selectedRange: '24h',
  onRangeChange: vi.fn(),
  ...overrides
})

const openDropdown = () => fireEvent.click(screen.getByTestId(SELECTOR_TESTID))

describe('TimeRangeSelector - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the selector button', () => {
    render(<TimeRangeSelector {...createProps()} />)
    expect(screen.getByTestId(SELECTOR_TESTID)).toBeInTheDocument()
  })

  it('displays "Last 24 Hours" for 24h range', () => {
    render(<TimeRangeSelector {...createProps({ selectedRange: '24h' })} />)
    expect(screen.getByText('Last 24 Hours')).toBeInTheDocument()
  })

  it('displays "Last Hour" for 1h range', () => {
    render(<TimeRangeSelector {...createProps({ selectedRange: '1h' })} />)
    expect(screen.getByText('Last Hour')).toBeInTheDocument()
  })

  it('displays "Last 7 Days" for 7d range', () => {
    render(<TimeRangeSelector {...createProps({ selectedRange: '7d' })} />)
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument()
  })

  it('displays "Last Month" for 30d range', () => {
    render(<TimeRangeSelector {...createProps({ selectedRange: '30d' })} />)
    expect(screen.getByText('Last Month')).toBeInTheDocument()
  })

  it('displays "Last 24 Hours" for legacy 1d range', () => {
    render(<TimeRangeSelector {...createProps({ selectedRange: '1d' })} />)
    expect(screen.getByText('Last 24 Hours')).toBeInTheDocument()
  })

  it('renders the selector for a custom range', () => {
    const customRange: CustomTimeRange = {
      from: DateTime.fromISO('2024-01-01T10:00:00'),
      to: DateTime.fromISO('2024-01-15T18:00:00')
    }
    render(
      <TimeRangeSelector {...createProps({ selectedRange: customRange })} />
    )

    expect(screen.getByTestId(SELECTOR_TESTID)).toBeInTheDocument()
  })
})

describe('TimeRangeSelector - Dropdown interaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens dropdown when selector is clicked', () => {
    render(<TimeRangeSelector {...createProps()} />)

    openDropdown()

    expect(screen.getByTestId(OPTION_1H_TESTID)).toBeInTheDocument()
    expect(screen.getByTestId('time-range-option-24h')).toBeInTheDocument()
    expect(screen.getByTestId('time-range-option-7d')).toBeInTheDocument()
    expect(screen.getByTestId('time-range-option-30d')).toBeInTheDocument()
  })

  it('closes dropdown when selector is clicked again', () => {
    render(<TimeRangeSelector {...createProps()} />)

    openDropdown()
    expect(screen.getByTestId(OPTION_1H_TESTID)).toBeInTheDocument()

    openDropdown()
    expect(screen.queryByTestId(OPTION_1H_TESTID)).not.toBeInTheDocument()
  })
})

describe('TimeRangeSelector - Quick option selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onRangeChange with 1h when Last Hour is clicked', () => {
    const onRangeChange = vi.fn()
    render(<TimeRangeSelector {...createProps({ onRangeChange })} />)

    openDropdown()
    fireEvent.click(screen.getByTestId(OPTION_1H_TESTID))

    expect(onRangeChange).toHaveBeenCalledWith('1h')
  })

  it('calls onRangeChange with 7d when Last 7 Days is clicked', () => {
    const onRangeChange = vi.fn()
    render(<TimeRangeSelector {...createProps({ onRangeChange })} />)

    openDropdown()
    fireEvent.click(screen.getByTestId('time-range-option-7d'))

    expect(onRangeChange).toHaveBeenCalledWith('7d')
  })

  it('closes dropdown after selecting a quick option', () => {
    render(<TimeRangeSelector {...createProps()} />)

    openDropdown()
    fireEvent.click(screen.getByTestId(OPTION_1H_TESTID))

    expect(screen.queryByTestId(OPTION_1H_TESTID)).not.toBeInTheDocument()
  })
})

describe('TimeRangeSelector - Custom range sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears the pending custom From/To when selectedRange switches to a preset', () => {
    const customRange: CustomTimeRange = {
      from: DateTime.fromISO('2024-01-01T10:00:00'),
      to: DateTime.fromISO('2024-01-15T18:00:00')
    }
    const { rerender } = render(
      <TimeRangeSelector
        onRangeChange={vi.fn()}
        selectedRange={customRange}
      />
    )

    openDropdown()
    expect(screen.getByTestId('apply-time-range-button')).not.toBeDisabled()

    rerender(
      <TimeRangeSelector
        onRangeChange={vi.fn()}
        selectedRange='24h'
      />
    )
    expect(screen.getByTestId('apply-time-range-button')).toBeDisabled()
  })
})

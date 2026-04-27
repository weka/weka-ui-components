import { fireEvent, render, screen } from '@testing-library/react'
import { DateTime } from 'luxon'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DateTimePicker } from './DateTimePicker'

const SAMPLE_ISO = '2024-03-15T12:00:00'
const PICKER_LABEL_SELECTOR = '.pickerLabel'

const openPicker = (container: HTMLElement) => {
  fireEvent.click(container.querySelector(PICKER_LABEL_SELECTOR)!)
}

describe('DateTimePicker - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the picker label trigger with formatted date/time', () => {
    render(
      <DateTimePicker
        onChange={vi.fn()}
        value={DateTime.fromISO('2024-03-15T12:30:00')}
      />
    )
    expect(screen.getByText(/•/)).toBeInTheDocument()
  })

  it('renders without value (empty state)', () => {
    const { container } = render(<DateTimePicker onChange={vi.fn()} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('does not show calendar by default', () => {
    render(
      <DateTimePicker
        onChange={vi.fn()}
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    expect(screen.queryByText('OK')).not.toBeInTheDocument()
  })
})

describe('DateTimePicker - Open/Close Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens calendar when label is clicked', () => {
    const { container } = render(
      <DateTimePicker
        onChange={vi.fn()}
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('shows Clear button when canClear is true', () => {
    const { container } = render(
      <DateTimePicker
        canClear
        onChange={vi.fn()}
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('hides Clear button when canClear is false', () => {
    const { container } = render(
      <DateTimePicker
        canClear={false}
        onChange={vi.fn()}
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })
})

describe('DateTimePicker - Submit Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onChange with current value when OK is clicked', () => {
    const onChange = vi.fn()
    const value = DateTime.fromISO(SAMPLE_ISO)
    const { container } = render(
      <DateTimePicker
        onChange={onChange}
        value={value}
      />
    )
    openPicker(container)
    fireEvent.click(screen.getByText('OK'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('calls onChange with undefined when Clear is clicked', () => {
    const onChange = vi.fn()
    const { container } = render(
      <DateTimePicker
        canClear
        onChange={onChange}
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    fireEvent.click(screen.getByText('Clear'))
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})

describe('DateTimePicker - showTime Variants', () => {
  it('shows OK button when showTime is true', () => {
    const { container } = render(
      <DateTimePicker
        onChange={vi.fn()}
        showTime
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('does not show OK/Clear buttons when showTime is false', () => {
    const { container } = render(
      <DateTimePicker
        onChange={vi.fn()}
        showTime={false}
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    expect(screen.queryByText('OK')).not.toBeInTheDocument()
  })
})

describe('DateTimePicker - Now Button', () => {
  it('shows Now button when showNow is true', () => {
    const { container } = render(
      <DateTimePicker
        onChange={vi.fn()}
        showNow
        value={DateTime.fromISO(SAMPLE_ISO)}
      />
    )
    openPicker(container)
    expect(screen.getByText('Now')).toBeInTheDocument()
  })
})

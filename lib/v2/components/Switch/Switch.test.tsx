import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Switch } from './Switch'

const createProps = (overrides = {}) => ({
  checked: false,
  onChange: vi.fn(),
  ...overrides
})

describe('Switch - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders switch component', () => {
    render(<Switch {...createProps()} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders unchecked by default', () => {
    render(<Switch {...createProps()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders checked when checked prop is true', () => {
    render(<Switch {...createProps({ checked: true })} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders with data-testid when provided', () => {
    render(<Switch {...createProps({ dataTestId: 'test-switch' })} />)
    expect(screen.getByTestId('test-switch')).toBeInTheDocument()
  })

  it('renders disabled when disabled prop is true', () => {
    render(<Switch {...createProps({ disabled: true })} />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('renders enabled by default', () => {
    render(<Switch {...createProps()} />)
    expect(screen.getByRole('checkbox')).not.toBeDisabled()
  })
})

describe('Switch - Tooltip', () => {
  it('does not render info icon when tooltip is not provided', () => {
    render(<Switch {...createProps()} />)
    const infoIcon = document.querySelector('[class*="infoIcon"]')
    expect(infoIcon).not.toBeInTheDocument()
  })

  it('renders info icon when tooltip is provided', () => {
    render(<Switch {...createProps({ tooltip: 'Help text' })} />)
    const infoIcon = document.querySelector('[class*="infoIcon"]')
    expect(infoIcon).toBeInTheDocument()
  })
})

describe('Switch - User Interactions', () => {
  it('calls onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Switch {...createProps({ onChange })} />)

    fireEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not allow interaction when disabled', () => {
    render(<Switch {...createProps({ disabled: true })} />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})

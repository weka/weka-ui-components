import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NumInputSpinButton } from './NumInputSpinButton'

const defaultProps = {
  onClickUp: vi.fn(),
  onClickDown: vi.fn()
}

describe('NumInputSpinButton - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders two buttons', () => {
    render(<NumInputSpinButton {...defaultProps} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('buttons are enabled by default', () => {
    render(<NumInputSpinButton {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeEnabled()
    expect(buttons[1]).toBeEnabled()
  })
})

describe('NumInputSpinButton - User Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onClickUp when first button is clicked', () => {
    const handleClickUp = vi.fn()
    render(
      <NumInputSpinButton
        onClickDown={vi.fn()}
        onClickUp={handleClickUp}
      />
    )
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(handleClickUp).toHaveBeenCalledTimes(1)
  })

  it('calls onClickDown when second button is clicked', () => {
    const handleClickDown = vi.fn()
    render(
      <NumInputSpinButton
        onClickDown={handleClickDown}
        onClickUp={vi.fn()}
      />
    )
    fireEvent.click(screen.getAllByRole('button')[1])
    expect(handleClickDown).toHaveBeenCalledTimes(1)
  })

  it('handles multiple clicks', () => {
    const handleClickUp = vi.fn()
    const clickCount = 3
    render(
      <NumInputSpinButton
        onClickDown={vi.fn()}
        onClickUp={handleClickUp}
      />
    )
    const button = screen.getAllByRole('button')[0]
    Array.from({ length: clickCount }).forEach(() => fireEvent.click(button))
    expect(handleClickUp).toHaveBeenCalledTimes(clickCount)
  })
})

describe('NumInputSpinButton - Disabled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disables both buttons when disabled prop is true', () => {
    render(
      <NumInputSpinButton
        {...defaultProps}
        disabled
      />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })

  it('does not call handlers when disabled', () => {
    const handleClickUp = vi.fn()
    const handleClickDown = vi.fn()
    render(
      <NumInputSpinButton
        disabled
        onClickDown={handleClickDown}
        onClickUp={handleClickUp}
      />
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])
    expect(handleClickUp).not.toHaveBeenCalled()
    expect(handleClickDown).not.toHaveBeenCalled()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { IconButton } from './IconButton'

const NOTIFICATIONS_LABEL = 'Notifications'

describe('IconButton', () => {
  it('renders the icon with the accessible name and fires onClick', () => {
    const onClick = vi.fn()
    render(
      <IconButton
        ariaLabel={NOTIFICATIONS_LABEL}
        onClick={onClick}
      >
        <svg data-testid='bell-icon' />
      </IconButton>
    )
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText(NOTIFICATIONS_LABEL))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows no badge when the count is 0', () => {
    render(
      <IconButton ariaLabel={NOTIFICATIONS_LABEL}>
        <svg />
      </IconButton>
    )
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows the badge count', () => {
    render(
      <IconButton
        ariaLabel={NOTIFICATIONS_LABEL}
        badgeCount={7}
      >
        <svg />
      </IconButton>
    )
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('overflows the badge above maxBadgeCount', () => {
    render(
      <IconButton
        ariaLabel={NOTIFICATIONS_LABEL}
        badgeCount={150}
      >
        <svg />
      </IconButton>
    )
    expect(screen.getByText('98+')).toBeInTheDocument()
  })

  it('applies the small variant class only when small is set', () => {
    const { rerender } = render(
      <IconButton ariaLabel={NOTIFICATIONS_LABEL}>
        <svg />
      </IconButton>
    )
    expect(screen.getByLabelText(NOTIFICATIONS_LABEL).className).not.toContain(
      'small'
    )
    rerender(
      <IconButton
        ariaLabel={NOTIFICATIONS_LABEL}
        small
      >
        <svg />
      </IconButton>
    )
    expect(screen.getByLabelText(NOTIFICATIONS_LABEL).className).toContain(
      'small'
    )
  })

  it('ignores clicks when disabled', () => {
    const onClick = vi.fn()
    render(
      <IconButton
        ariaLabel={NOTIFICATIONS_LABEL}
        disabled
        onClick={onClick}
      >
        <svg />
      </IconButton>
    )
    fireEvent.click(screen.getByLabelText(NOTIFICATIONS_LABEL))
    expect(onClick).not.toHaveBeenCalled()
  })
})

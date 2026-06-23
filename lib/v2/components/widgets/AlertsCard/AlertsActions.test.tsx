import type { ReactNode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AlertsActions } from './AlertsActions'

vi.mock('../../MenuPopover', () => ({
  MenuPopover: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div>{children}</div> : null
}))

const baseProps = {
  sortField: 'date' as const,
  sortOrder: 'desc' as const,
  showMuted: false,
  onChange: vi.fn(),
  onToggleMuted: vi.fn()
}

const openMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Sort by' }))
}

describe('AlertsActions', () => {
  it('sorts by a newly chosen field descending', () => {
    const onChange = vi.fn()
    render(
      <AlertsActions
        {...baseProps}
        onChange={onChange}
      />
    )
    openMenu()
    fireEvent.click(screen.getByRole('button', { name: /Severity/ }))
    expect(onChange).toHaveBeenCalledWith('severity', 'desc')
  })

  it('flips the order when the active field is re-selected', () => {
    const onChange = vi.fn()
    render(
      <AlertsActions
        {...baseProps}
        onChange={onChange}
        sortField='date'
        sortOrder='desc'
      />
    )
    openMenu()
    fireEvent.click(screen.getByRole('button', { name: /Date/ }))
    expect(onChange).toHaveBeenCalledWith('date', 'asc')
  })

  it('toggles show-muted', () => {
    const onToggleMuted = vi.fn()
    render(
      <AlertsActions
        {...baseProps}
        onToggleMuted={onToggleMuted}
      />
    )
    openMenu()
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggleMuted).toHaveBeenCalledTimes(1)
  })

  it('renders the link button only when onLinkClick is provided', () => {
    const { rerender } = render(<AlertsActions {...baseProps} />)
    expect(
      screen.queryByTestId('alerts-card-link-button')
    ).not.toBeInTheDocument()

    const onLinkClick = vi.fn()
    rerender(
      <AlertsActions
        {...baseProps}
        onLinkClick={onLinkClick}
      />
    )
    fireEvent.click(screen.getByTestId('alerts-card-link-button'))
    expect(onLinkClick).toHaveBeenCalledTimes(1)
  })
})

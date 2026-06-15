import type { SidebarItem } from '../types'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NavLink } from './NavLink'

const item: SidebarItem = {
  key: 'monitor',
  label: 'Monitor',
  icon: <svg data-testid='icon' />
}

describe('NavLink', () => {
  it('renders the label and icon', () => {
    render(
      <NavLink
        active={false}
        hasSub={false}
        isHybrid={false}
        isOpen={false}
        isSidebarExpanded
        item={item}
        onClick={vi.fn()}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByText('Monitor')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('exposes aria-expanded only when it has sub-items', () => {
    const { rerender } = render(
      <NavLink
        active={false}
        hasSub={false}
        isHybrid={false}
        isOpen={false}
        isSidebarExpanded
        item={item}
        onClick={vi.fn()}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-expanded')
    rerender(
      <NavLink
        active={false}
        hasSub
        isHybrid={false}
        isOpen
        isSidebarExpanded
        item={item}
        onClick={vi.fn()}
        onToggle={vi.fn()}
      />
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('fires onClick when pressed', () => {
    const onClick = vi.fn()
    render(
      <NavLink
        active={false}
        hasSub={false}
        isHybrid={false}
        isOpen={false}
        isSidebarExpanded
        item={item}
        onClick={onClick}
        onToggle={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

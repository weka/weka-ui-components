import type { SidebarItem } from '../types'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NavItem } from './NavItem'

const SUBITEM_LABEL = 'Background Tasks'

const parentItem: SidebarItem = {
  key: 'monitor',
  label: 'Monitor',
  icon: <svg />,
  subItems: [{ key: 'tasks', label: SUBITEM_LABEL, href: '/monitor/tasks' }]
}

const leafItem: SidebarItem = {
  key: 'clusters',
  label: 'Clusters',
  icon: <svg />,
  href: '/clusters'
}

const renderNavItem = (props: Partial<Parameters<typeof NavItem>[0]> = {}) =>
  render(
    <ul>
      <NavItem
        currentPath='/'
        isOpen={false}
        isSidebarExpanded
        item={parentItem}
        onExpand={vi.fn()}
        onNavigate={vi.fn()}
        onOpenSubmenu={vi.fn()}
        onToggleSubmenu={vi.fn()}
        {...props}
      />
    </ul>
  )

describe('NavItem', () => {
  it('renders its submenu only when isOpen is true', () => {
    const { rerender } = renderNavItem({ isOpen: false })
    expect(screen.queryByText(SUBITEM_LABEL)).not.toBeInTheDocument()

    rerender(
      <ul>
        <NavItem
          currentPath='/'
          isOpen
          isSidebarExpanded
          item={parentItem}
          onExpand={vi.fn()}
          onNavigate={vi.fn()}
          onOpenSubmenu={vi.fn()}
          onToggleSubmenu={vi.fn()}
        />
      </ul>
    )
    expect(screen.getByText(SUBITEM_LABEL)).toBeInTheDocument()
  })

  it('asks to toggle its submenu when the expanded parent is clicked', () => {
    const onToggleSubmenu = vi.fn()
    renderNavItem({ onToggleSubmenu })

    fireEvent.click(screen.getByText('Monitor'))

    expect(onToggleSubmenu).toHaveBeenCalledTimes(1)
  })

  it('expands the sidebar and opens its submenu when clicked while collapsed', () => {
    const onExpand = vi.fn()
    const onOpenSubmenu = vi.fn()
    renderNavItem({ isSidebarExpanded: false, onExpand, onOpenSubmenu })

    fireEvent.click(screen.getByText('Monitor'))

    expect(onExpand).toHaveBeenCalledTimes(1)
    expect(onOpenSubmenu).toHaveBeenCalledTimes(1)
  })

  it('navigates a leaf item that has no submenu', () => {
    const onNavigate = vi.fn()
    renderNavItem({ item: leafItem, onNavigate })

    fireEvent.click(screen.getByText('Clusters'))

    expect(onNavigate).toHaveBeenCalledWith('/clusters')
  })
})

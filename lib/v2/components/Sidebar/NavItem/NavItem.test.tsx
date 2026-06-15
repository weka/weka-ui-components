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

describe('NavItem', () => {
  it('toggles its submenu open when the parent is clicked', () => {
    render(
      <ul>
        <NavItem
          currentPath='/'
          isSidebarExpanded
          item={parentItem}
          onExpand={vi.fn()}
          onNavigate={vi.fn()}
        />
      </ul>
    )
    expect(screen.queryByText(SUBITEM_LABEL)).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Monitor'))
    expect(screen.getByText(SUBITEM_LABEL)).toBeInTheDocument()
  })

  it('navigates a leaf item that has no submenu', () => {
    const onNavigate = vi.fn()
    render(
      <ul>
        <NavItem
          currentPath='/'
          isSidebarExpanded
          item={leafItem}
          onExpand={vi.fn()}
          onNavigate={onNavigate}
        />
      </ul>
    )
    fireEvent.click(screen.getByText('Clusters'))
    expect(onNavigate).toHaveBeenCalledWith('/clusters')
  })
})

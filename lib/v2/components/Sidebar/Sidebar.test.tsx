import type { SidebarItem } from './types'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from './Sidebar'

const MONITOR_LABEL = 'Monitor'
const TASKS_LABEL = 'Background Tasks'
const INVESTIGATE_LABEL = 'Investigate'
const EVENTS_LABEL = 'Events'
const TASKS_PATH = '/monitor/tasks'
const CLUSTERS_PATH = '/clusters'
const CLUSTER_ONE = 'Cluster One'

const items: SidebarItem[] = [
  {
    key: 'monitor',
    label: MONITOR_LABEL,
    icon: <svg data-testid='monitor-icon' />,
    subItems: [
      {
        key: 'dashboard',
        label: 'System Dashboard',
        href: '/monitor/dashboard'
      },
      { key: 'tasks', label: TASKS_LABEL, href: TASKS_PATH }
    ]
  },
  { key: 'clusters', label: 'Clusters', icon: <svg />, href: '/clusters' },
  {
    key: 'investigate',
    label: INVESTIGATE_LABEL,
    icon: <svg />,
    subItems: [{ key: 'events', label: EVENTS_LABEL }]
  }
]

describe('Sidebar', () => {
  it('renders top-level items', () => {
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={vi.fn()}
      />
    )
    expect(screen.getByText(MONITOR_LABEL)).toBeInTheDocument()
    expect(screen.getByText('Clusters')).toBeInTheDocument()
  })

  it('merges extraClass onto the sidebar root', () => {
    render(
      <Sidebar
        currentPath='/'
        extraClass='customSurface'
        items={items}
        onNavigate={vi.fn()}
      />
    )
    expect(screen.getByTestId('sidebar')).toHaveClass('customSurface')
  })

  it('navigates on a leaf item click', () => {
    const onNavigate = vi.fn()
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText('Clusters'))
    expect(onNavigate).toHaveBeenCalledWith(CLUSTERS_PATH)
  })

  it('keeps a submenu collapsed until its parent is opened', () => {
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={vi.fn()}
      />
    )
    expect(screen.queryByText(TASKS_LABEL)).not.toBeInTheDocument()
    fireEvent.click(screen.getByText(MONITOR_LABEL))
    expect(screen.getByText(TASKS_LABEL)).toBeInTheDocument()
  })

  it('auto-opens the submenu of the active section', () => {
    render(
      <Sidebar
        currentPath='/monitor/dashboard'
        defaultExpanded
        items={items}
        onNavigate={vi.fn()}
      />
    )
    expect(screen.getByText('System Dashboard')).toBeInTheDocument()
  })

  it('keeps only one submenu open at a time (accordion)', () => {
    render(
      <Sidebar
        currentPath='/'
        defaultExpanded
        items={items}
        onNavigate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByText(MONITOR_LABEL))
    expect(screen.getByText(TASKS_LABEL)).toBeInTheDocument()

    fireEvent.click(screen.getByText(INVESTIGATE_LABEL))
    expect(screen.getByText(EVENTS_LABEL)).toBeInTheDocument()
    expect(screen.queryByText(TASKS_LABEL)).not.toBeInTheDocument()
  })

  it('navigates on a sub-item click', () => {
    const onNavigate = vi.fn()
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText(MONITOR_LABEL))
    fireEvent.click(screen.getByText(TASKS_LABEL))
    expect(onNavigate).toHaveBeenCalledWith(TASKS_PATH)
  })

  it('disables sub-items without an href', () => {
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByText(INVESTIGATE_LABEL))
    expect(screen.getByText(EVENTS_LABEL).closest('button')).toBeDisabled()
  })

  it('toggles expanded state via the toggle button', () => {
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Expand sidebar'))
    expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument()
  })

  it('fires onClick for footer items', () => {
    const onLogout = vi.fn()
    render(
      <Sidebar
        currentPath='/'
        items={items}
        onNavigate={vi.fn()}
        footerItems={[
          { key: 'logout', label: 'Log Out', icon: <svg />, onClick: onLogout }
        ]}
      />
    )
    fireEvent.click(screen.getByText('Log Out'))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('navigates the row but toggles the submenu via the chevron for a hybrid item', () => {
    const onNavigate = vi.fn()
    const hybridItems: SidebarItem[] = [
      {
        key: 'clusters',
        label: 'Clusters',
        icon: <svg />,
        href: CLUSTERS_PATH,
        subItems: [{ key: 'c1', label: CLUSTER_ONE, href: '/clusters/c1' }]
      }
    ]
    render(
      <Sidebar
        currentPath='/'
        defaultExpanded
        items={hybridItems}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText('Clusters'))
    expect(onNavigate).toHaveBeenCalledWith(CLUSTERS_PATH)
    expect(screen.queryByText(CLUSTER_ONE)).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Toggle submenu'))
    expect(screen.getByText(CLUSTER_ONE)).toBeInTheDocument()
  })

  it('renders a divider before an item flagged dividerBefore', () => {
    const dividerItems: SidebarItem[] = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: <svg />,
        href: '/dashboard'
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <svg />,
        dividerBefore: true,
        subItems: [
          { key: 'general', label: 'General', href: '/settings/general' }
        ]
      }
    ]
    const { container } = render(
      <Sidebar
        currentPath='/'
        defaultExpanded
        items={dividerItems}
        onNavigate={vi.fn()}
      />
    )
    expect(container.querySelector('li[aria-hidden]')).toBeInTheDocument()
  })
})

describe('Sidebar - route-driven submenu', () => {
  const sections: SidebarItem[] = [
    {
      key: 'monitor',
      label: MONITOR_LABEL,
      icon: <svg />,
      subItems: [{ key: 'tasks', label: TASKS_LABEL, href: TASKS_PATH }]
    },
    {
      key: 'investigate',
      label: INVESTIGATE_LABEL,
      icon: <svg />,
      subItems: [
        { key: 'events', label: EVENTS_LABEL, href: '/investigate/events' }
      ]
    }
  ]

  it('re-opens the active route submenu after a manual collapse when the route changes', () => {
    const { rerender } = render(
      <Sidebar
        currentPath={TASKS_PATH}
        defaultExpanded
        items={sections}
        onNavigate={vi.fn()}
      />
    )
    expect(screen.getByText(TASKS_LABEL)).toBeInTheDocument()

    fireEvent.click(screen.getByText(MONITOR_LABEL))
    expect(screen.queryByText(TASKS_LABEL)).not.toBeInTheDocument()

    rerender(
      <Sidebar
        currentPath='/investigate/events'
        defaultExpanded
        items={sections}
        onNavigate={vi.fn()}
      />
    )
    expect(screen.getByText(EVENTS_LABEL)).toBeInTheDocument()
  })
})

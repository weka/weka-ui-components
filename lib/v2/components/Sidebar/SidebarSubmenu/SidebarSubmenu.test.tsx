import type { SidebarItem } from '../types'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SidebarSubmenu } from './SidebarSubmenu'

const item: SidebarItem = {
  key: 'investigate',
  label: 'Investigate',
  icon: <svg />,
  subItems: [
    { key: 'events', label: 'Events', href: '/events' },
    { key: 'insights', label: 'Insights' }
  ]
}

const renderSubmenu = (onNavigate = vi.fn()) => {
  render(
    <SidebarSubmenu
      currentPath='/'
      flyout={false}
      item={item}
      onNavigate={onNavigate}
    />
  )
  return onNavigate
}

describe('SidebarSubmenu', () => {
  it('renders the sub-items', () => {
    renderSubmenu()
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Insights')).toBeInTheDocument()
  })

  it('disables sub-items without an href', () => {
    renderSubmenu()
    expect(screen.getByText('Insights').closest('button')).toBeDisabled()
  })

  it('navigates on a sub-item click', () => {
    const onNavigate = renderSubmenu()
    fireEvent.click(screen.getByText('Events'))
    expect(onNavigate).toHaveBeenCalledWith('/events')
  })
})

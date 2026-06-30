import type { Tab } from '../tabsConstants'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TabIcon } from './TabIcon'

const baseTab: Tab = { id: 'tab-1', label: 'Tab 1' }

describe('TabIcon', () => {
  it('renders the Icon component when tab.Icon is provided', () => {
    function MockIcon() {
      return <svg data-testid='mock-icon' />
    }
    render(
      <TabIcon
        isActive={false}
        tab={{ ...baseTab, Icon: MockIcon }}
      />
    )

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('renders the icon ReactNode when tab.icon is provided', () => {
    render(
      <TabIcon
        isActive={false}
        tab={{ ...baseTab, icon: <span data-testid='icon-node'>Icon</span> }}
      />
    )

    expect(screen.getByTestId('icon-node')).toBeInTheDocument()
  })

  it('renders nothing when no icon is provided', () => {
    const { container } = render(
      <TabIcon
        isActive={false}
        tab={baseTab}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})

import type { Tab } from '../tabsConstants'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TAB_VARIANTS } from '../tabsConstants'
import { TabCount } from './TabCount'

const baseTab: Tab = { id: 'tab-1', label: 'Tab 1' }
const COUNT = 2
const MAX_COUNT = 1024

describe('TabCount', () => {
  it('renders nothing when the tab has no count', () => {
    const { container } = render(
      <TabCount
        tab={baseTab}
        variant={TAB_VARIANTS.UNDERLINE}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('wraps the count in parentheses for the underline variant', () => {
    render(
      <TabCount
        tab={{ ...baseTab, count: COUNT }}
        variant={TAB_VARIANTS.UNDERLINE}
      />
    )

    expect(screen.getByText(`(${COUNT})`)).toBeInTheDocument()
  })

  it('renders the bare count for the primary variant', () => {
    render(
      <TabCount
        tab={{ ...baseTab, count: COUNT }}
        variant={TAB_VARIANTS.PRIMARY}
      />
    )

    expect(screen.getByText(COUNT)).toBeInTheDocument()
  })

  it('renders the count with its maximum when maxCount is provided', () => {
    render(
      <TabCount
        tab={{ ...baseTab, count: COUNT, maxCount: MAX_COUNT }}
        variant={TAB_VARIANTS.UNDERLINE}
      />
    )

    expect(screen.getByText(`(${COUNT} of ${MAX_COUNT})`)).toBeInTheDocument()
  })
})

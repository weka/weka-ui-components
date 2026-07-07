import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WidgetCard } from './WidgetCard'

const CARD_TITLE = 'Cluster Protection'
const CARD_TOOLTIP = 'Shows cluster protection state'
const CHILD_CONTENT = 'Widget content is here'

describe('WidgetCard', () => {
  it('renders the title and child content when data is non-null', () => {
    render(
      <WidgetCard
        data={{ label: CHILD_CONTENT }}
        title={CARD_TITLE}
        tooltip={CARD_TOOLTIP}
      >
        {(resolved) => <span>{resolved.label}</span>}
      </WidgetCard>
    )

    expect(screen.getByText(CARD_TITLE)).toBeInTheDocument()
    expect(screen.getByText(CHILD_CONTENT)).toBeInTheDocument()
  })

  it('shows the loading state and omits child content when data is null', () => {
    render(
      <WidgetCard
        data={null}
        title={CARD_TITLE}
        tooltip={CARD_TOOLTIP}
      >
        {() => <span>{CHILD_CONTENT}</span>}
      </WidgetCard>
    )

    expect(screen.queryByText(CHILD_CONTENT)).not.toBeInTheDocument()
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })

  it('renders without a tooltip', () => {
    render(
      <WidgetCard
        data={{ label: CHILD_CONTENT }}
        title={CARD_TITLE}
      >
        {(resolved) => <span>{resolved.label}</span>}
      </WidgetCard>
    )

    expect(screen.getByText(CARD_TITLE)).toBeInTheDocument()
  })
})

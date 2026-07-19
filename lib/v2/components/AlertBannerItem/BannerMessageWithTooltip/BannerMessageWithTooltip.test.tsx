import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BannerMessageWithTooltip } from './BannerMessageWithTooltip'

describe('BannerMessageWithTooltip', () => {
  it('renders its children', () => {
    render(
      <BannerMessageWithTooltip fullText='Full message text'>
        <span>Visible message</span>
      </BannerMessageWithTooltip>
    )
    expect(screen.getByText('Visible message')).toBeInTheDocument()
  })

  it('does not show the tooltip popup until hovered', () => {
    render(
      <BannerMessageWithTooltip fullText='Full message text'>
        Visible message
      </BannerMessageWithTooltip>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CAPSULE_TONES, VerticalCapsule } from './VerticalCapsule'

describe('VerticalCapsule', () => {
  it('renders the label', () => {
    render(
      <VerticalCapsule
        fillPercentage={50}
        label='SSD'
        tone={CAPSULE_TONES.SSD}
      />
    )

    expect(screen.getByText('SSD')).toBeInTheDocument()
  })

  it('fills the bar to the given percentage', () => {
    const { container } = render(
      <VerticalCapsule
        fillPercentage={42}
        label='SSD'
        tone={CAPSULE_TONES.SSD}
      />
    )

    expect(container.querySelector('[class*="capsuleFill"]')).toHaveStyle({
      height: '42%'
    })
  })

  it('clamps the fill to 100% when it exceeds the range', () => {
    const { container } = render(
      <VerticalCapsule
        fillPercentage={150}
        label='OBS'
        tone={CAPSULE_TONES.OBS}
      />
    )

    expect(container.querySelector('[class*="capsuleFill"]')).toHaveStyle({
      height: '100%'
    })
  })

  it('applies the wide modifier when wide is set', () => {
    const { container } = render(
      <VerticalCapsule
        fillPercentage={10}
        label='SSD'
        tone={CAPSULE_TONES.SSD}
        wide
      />
    )

    expect(
      container.querySelector('[class*="capsuleBarWide"]')
    ).toBeInTheDocument()
  })
})

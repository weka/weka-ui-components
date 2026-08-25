import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Stepper } from './Stepper'

const STEPS = [{ label: 'Source' }, { label: 'Target' }, { label: 'Review' }]

describe('Stepper', () => {
  it('renders every step label', () => {
    render(
      <Stepper
        currentIndex={0}
        steps={STEPS}
      />
    )

    expect(screen.getByText('Source')).toBeInTheDocument()
    expect(screen.getByText('Target')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('numbers steps that have not been reached', () => {
    render(
      <Stepper
        currentIndex={0}
        steps={STEPS}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders a checkmark for completed steps', () => {
    const { container } = render(
      <Stepper
        currentIndex={2}
        steps={STEPS}
      />
    )

    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })

  it('marks the current step with aria-current', () => {
    render(
      <Stepper
        currentIndex={1}
        steps={STEPS}
      />
    )

    const currentStep = screen.getByText('Target').closest('li')
    expect(currentStep).toHaveAttribute('aria-current', 'step')
  })

  it('does not mark non-current steps with aria-current', () => {
    render(
      <Stepper
        currentIndex={1}
        steps={STEPS}
      />
    )

    const firstStep = screen.getByText('Source').closest('li')
    expect(firstStep).not.toHaveAttribute('aria-current')
  })

  it('renders an error indicator instead of a checkmark for a failed step', () => {
    const { container } = render(
      <Stepper
        currentIndex={2}
        steps={[
          { label: 'Source' },
          { label: 'Target', hasError: true },
          { label: 'Review' }
        ]}
      />
    )

    expect(
      container.querySelector('[class*="indicatorError"]')
    ).toBeInTheDocument()
    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })

  it('keeps the error look even on the current step', () => {
    const { container } = render(
      <Stepper
        currentIndex={1}
        steps={[
          { label: 'Source' },
          { label: 'Target', hasError: true },
          { label: 'Review' }
        ]}
      />
    )

    const errorIndicator = container.querySelector('[class*="indicatorError"]')
    expect(errorIndicator).toBeInTheDocument()
    expect(errorIndicator?.className).not.toContain('indicatorCurrent')
  })

  it('renders a horizontal rail when requested', () => {
    const { container } = render(
      <Stepper
        currentIndex={0}
        orientation='horizontal'
        steps={STEPS}
      />
    )

    expect(container.querySelector('[class*="horizontal"]')).toBeInTheDocument()
  })
})

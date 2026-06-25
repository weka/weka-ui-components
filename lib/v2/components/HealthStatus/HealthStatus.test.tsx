import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HealthStatus } from './HealthStatus'

describe('HealthStatus', () => {
  it('renders the label', () => {
    render(
      <HealthStatus
        iconType='check'
        label='Fully Protected'
        severity='success'
      />
    )

    expect(screen.getByText('Fully Protected')).toBeInTheDocument()
  })

  it('applies the severity class to the root', () => {
    const { container } = render(
      <HealthStatus
        dataTestId='health'
        iconType='warningTriangle'
        label='Unprotected'
        severity='error'
      />
    )

    const root = screen.getByTestId('health')
    expect(root.className).toContain('error')
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows the progress bar and percentage when progress > 0', () => {
    render(
      <HealthStatus
        iconType='check'
        label='Rebuilding'
        progress={42.5}
        severity='warning'
      />
    )

    expect(screen.getByText('42.5%')).toBeInTheDocument()
  })

  it('shows the progress bar at 0% when progress is 0', () => {
    render(
      <HealthStatus
        iconType='check'
        label='Rebuilding'
        progress={0}
        severity='warning'
      />
    )

    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })

  it('hides progress when not provided', () => {
    render(
      <HealthStatus
        iconType='check'
        label='Fully Protected'
        severity='success'
      />
    )

    expect(screen.queryByText(/%$/)).not.toBeInTheDocument()
  })
})

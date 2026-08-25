import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StepperRow } from './StepperRow'

describe('StepperRow', () => {
  it('renders the step number for a pending step', () => {
    render(
      <StepperRow
        label='Create replication link'
        stepNumber={2}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders the label and description', () => {
    render(
      <StepperRow
        description='Establishes the peer relationship.'
        label='Create replication link'
        stepNumber={1}
      />
    )

    expect(screen.getByText('Create replication link')).toBeInTheDocument()
    expect(
      screen.getByText('Establishes the peer relationship.')
    ).toBeInTheDocument()
  })

  it('renders no description when omitted', () => {
    const { container } = render(
      <StepperRow
        label='Create replication link'
        stepNumber={1}
      />
    )

    expect(container.querySelector('[class*="description"]')).toBeNull()
  })

  it('renders a checkmark instead of the step number when done', () => {
    const { container } = render(
      <StepperRow
        label='Create replication link'
        state='done'
        stepNumber={1}
      />
    )

    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('renders neither the number nor a checkmark while running', () => {
    const { container } = render(
      <StepperRow
        label='Create replication link'
        state='running'
        stepNumber={1}
      />
    )

    expect(container.querySelector('svg')).not.toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('renders the state label when provided', () => {
    render(
      <StepperRow
        label='Create replication link'
        state='done'
        stateLabel='Done'
        stepNumber={1}
      />
    )

    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders no state label when omitted', () => {
    render(
      <StepperRow
        label='Create replication link'
        stepNumber={1}
      />
    )

    expect(screen.queryByText('Pending')).not.toBeInTheDocument()
  })
})

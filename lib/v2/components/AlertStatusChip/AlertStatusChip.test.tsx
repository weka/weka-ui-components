import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AlertStatusChip } from './AlertStatusChip'

describe('AlertStatusChip', () => {
  it('renders the active label by default', () => {
    render(<AlertStatusChip status='active' />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders the closed label for a closed alert', () => {
    render(<AlertStatusChip status='closed' />)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('uses provided labels', () => {
    render(
      <AlertStatusChip
        labels={{ active: 'Open' }}
        status='active'
      />
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('honors a custom dataTestId', () => {
    render(
      <AlertStatusChip
        dataTestId='my-chip'
        status='active'
      />
    )
    expect(screen.getByTestId('my-chip')).toBeInTheDocument()
  })
})

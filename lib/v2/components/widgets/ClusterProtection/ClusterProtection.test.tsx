import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ClusterProtection } from './ClusterProtection'

describe('ClusterProtection', () => {
  it('renders the protection status badge and drive counts', () => {
    render(
      <ClusterProtection
        stripeDataDrives={6}
        stripeProtectionDrives={2}
        systemStatus='OK'
        upFor='3d 4h'
        virtualSpares='3'
      />
    )

    expect(screen.getByTestId('protection-status-badge')).toBeInTheDocument()
    expect(screen.getByTestId('protection-data-drives')).toHaveTextContent('6')
    expect(screen.getByTestId('protection-parity-drives')).toHaveTextContent(
      '2'
    )
    expect(screen.getByTestId('protection-up-for-time')).toHaveTextContent(
      '3d 4h'
    )
  })

  it('renders no status badge when systemStatus is missing', () => {
    render(
      <ClusterProtection
        stripeDataDrives={6}
        stripeProtectionDrives={2}
      />
    )

    expect(
      screen.queryByTestId('protection-status-badge')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('protection-data-drives')).toHaveTextContent('6')
  })

  it('shows the virtual-spares value and label', () => {
    render(
      <ClusterProtection
        stripeDataDrives={4}
        systemStatus='OK'
        virtualSpares='5'
      />
    )

    expect(screen.getByTestId('protection-virtual-spares')).toHaveTextContent(
      'Virtual Spares: 5'
    )
  })

  it('omits the parity group when there are no protection drives', () => {
    render(
      <ClusterProtection
        stripeDataDrives={4}
        stripeProtectionDrives={0}
        systemStatus='OK'
      />
    )

    expect(
      screen.queryByTestId('protection-parity-drives')
    ).not.toBeInTheDocument()
  })

  it('applies custom labels', () => {
    render(
      <ClusterProtection
        labels={{ dataProtection: 'Custom Protection', upFor: 'Online For' }}
        stripeDataDrives={4}
        systemStatus='OK'
      />
    )

    expect(screen.getByText('Custom Protection')).toBeInTheDocument()
    expect(screen.getByText('Online For:')).toBeInTheDocument()
  })
})

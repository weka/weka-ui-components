import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeaderMetaBanner } from './HeaderMetaBanner'

const items = [
  { key: 'cluster', label: 'Cluster', value: 'DFW01-PROD' },
  { key: 'tenant', label: 'Tenant', value: 'Tenant_AB3561' }
]

describe('HeaderMetaBanner', () => {
  it('renders each item as a label/value pair', () => {
    render(<HeaderMetaBanner items={items} />)
    expect(screen.getByText('Cluster')).toBeInTheDocument()
    expect(screen.getByText('DFW01-PROD')).toBeInTheDocument()
    expect(screen.getByText('Tenant')).toBeInTheDocument()
    expect(screen.getByText('Tenant_AB3561')).toBeInTheDocument()
  })

  it('renders the leading slot and item trailing content', () => {
    render(
      <HeaderMetaBanner
        leading={<span data-testid='status-chip' />}
        items={[
          {
            key: 'time',
            label: 'Local Time',
            value: '11:45AM',
            trailing: <button type='button'>swap</button>
          }
        ]}
      />
    )
    expect(screen.getByTestId('status-chip')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'swap' })).toBeInTheDocument()
  })
})

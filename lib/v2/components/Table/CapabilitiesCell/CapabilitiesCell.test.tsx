import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { CapabilitiesCell } from './CapabilitiesCell'

afterEach(() => {
  cleanup()
})

describe('CapabilitiesCell — badge visibility', () => {
  it('renders no badges and returns null when no flags are set', () => {
    const { container } = render(<CapabilitiesCell />)
    expect(container.firstChild).toBeNull()
  })

  it('renders only the Thin badge when thinlyProvisioned is true', () => {
    render(<CapabilitiesCell thinlyProvisioned />)
    expect(screen.getByText('Thin')).toBeInTheDocument()
    expect(screen.queryByText('Tier')).not.toBeInTheDocument()
    expect(screen.queryByText('Enc.')).not.toBeInTheDocument()
  })

  it('renders only the Tier badge when tiered is true', () => {
    render(<CapabilitiesCell tiered />)
    expect(screen.getByText('Tier')).toBeInTheDocument()
    expect(screen.queryByText('Thin')).not.toBeInTheDocument()
    expect(screen.queryByText('Enc.')).not.toBeInTheDocument()
  })

  it('renders only the Enc. badge when encrypted is true', () => {
    render(<CapabilitiesCell encrypted />)
    expect(screen.getByText('Enc.')).toBeInTheDocument()
    expect(screen.queryByText('Thin')).not.toBeInTheDocument()
    expect(screen.queryByText('Tier')).not.toBeInTheDocument()
  })

  it('renders all three badges when all flags are true', () => {
    render(
      <CapabilitiesCell
        encrypted
        thinlyProvisioned
        tiered
      />
    )
    expect(screen.getByText('Thin')).toBeInTheDocument()
    expect(screen.getByText('Tier')).toBeInTheDocument()
    expect(screen.getByText('Enc.')).toBeInTheDocument()
  })

  it('renders Thin and Enc. but not Tier when tiered is false', () => {
    render(
      <CapabilitiesCell
        encrypted
        thinlyProvisioned
      />
    )
    expect(screen.getByText('Thin')).toBeInTheDocument()
    expect(screen.queryByText('Tier')).not.toBeInTheDocument()
    expect(screen.getByText('Enc.')).toBeInTheDocument()
  })
})

describe('CapabilitiesCell — badge order', () => {
  it('renders badges in Thin → Tier → Enc. order', () => {
    render(
      <CapabilitiesCell
        encrypted
        thinlyProvisioned
        tiered
      />
    )
    const badges = screen.getAllByText(/Thin|Tier|Enc\./)
    expect(badges[0]).toHaveTextContent('Thin')
    expect(badges[1]).toHaveTextContent('Tier')
    expect(badges[2]).toHaveTextContent('Enc.')
  })
})

describe('CapabilitiesCell — false flags', () => {
  it('does not render a badge when its flag is explicitly false', () => {
    render(
      <CapabilitiesCell
        encrypted={false}
        thinlyProvisioned={false}
        tiered={false}
      />
    )
    expect(screen.queryByText('Thin')).not.toBeInTheDocument()
    expect(screen.queryByText('Tier')).not.toBeInTheDocument()
    expect(screen.queryByText('Enc.')).not.toBeInTheDocument()
  })
})

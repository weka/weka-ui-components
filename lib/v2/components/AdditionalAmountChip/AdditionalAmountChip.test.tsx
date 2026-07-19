import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AdditionalAmountChip } from './AdditionalAmountChip'

describe('AdditionalAmountChip - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with count prefixed by plus sign', () => {
    render(
      <AdditionalAmountChip
        count={5}
        tooltipContent='5 more items'
      />
    )
    expect(screen.getByText('+5')).toBeInTheDocument()
  })

  it('renders with zero count', () => {
    render(
      <AdditionalAmountChip
        count={0}
        tooltipContent='No additional items'
      />
    )
    expect(screen.getByText('+0')).toBeInTheDocument()
  })

  it('renders with large count', () => {
    render(
      <AdditionalAmountChip
        count={999}
        tooltipContent='999 more items'
      />
    )
    expect(screen.getByText('+999')).toBeInTheDocument()
  })

  it('applies chip styles by default', () => {
    render(
      <AdditionalAmountChip
        count={5}
        tooltipContent='5 more items'
      />
    )
    expect(screen.getByText('+5')).toHaveClass('chip')
  })
})

describe('AdditionalAmountChip - Styling', () => {
  it('applies extraClass alongside the chip class when provided', () => {
    render(
      <AdditionalAmountChip
        count={5}
        extraClass='custom-class'
        tooltipContent='5 more items'
      />
    )
    const chip = screen.getByText('+5')
    expect(chip).toHaveClass('chip')
    expect(chip).toHaveClass('custom-class')
  })

  it('renders without a stray undefined class when extraClass is omitted', () => {
    render(
      <AdditionalAmountChip
        count={5}
        tooltipContent='5 more items'
      />
    )
    expect(screen.getByText('+5').className).not.toContain('undefined')
  })
})

describe('AdditionalAmountChip - Tooltip integration', () => {
  it('exposes the tooltip content as the accessible label', () => {
    const tooltipContent = 'eth1, eth2, eth3'
    render(
      <AdditionalAmountChip
        count={3}
        tooltipContent={tooltipContent}
      />
    )
    expect(screen.getByLabelText(tooltipContent)).toContainElement(
      screen.getByText('+3')
    )
  })
})

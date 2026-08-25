import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { STATUS_VARIANTS } from '../Table/StatusCell'
import { StatusChip } from './StatusChip'

const REPLICATING_LABEL = 'Replicating'
const CHIP_INFO_SELECTOR = '[class*="chipInfo"]'

describe('StatusChip', () => {
  it('renders the label', () => {
    render(<StatusChip label='Healthy' />)

    expect(screen.getByText('Healthy')).toBeInTheDocument()
  })

  it('renders a variant-colored dot when a variant is given', () => {
    const { container } = render(
      <StatusChip
        label={REPLICATING_LABEL}
        variant={STATUS_VARIANTS.INFO}
      />
    )

    expect(container.querySelector('[class*="dotInfo"]')).toBeInTheDocument()
  })

  it('renders no dot when neither variant nor color is given', () => {
    const { container } = render(<StatusChip label='eu-west-1' />)

    expect(container.querySelector('[class*="dot"]')).not.toBeInTheDocument()
  })

  it('tints the pill background to match the variant', () => {
    const { container } = render(
      <StatusChip
        label={REPLICATING_LABEL}
        variant={STATUS_VARIANTS.INFO}
      />
    )

    expect(container.querySelector(CHIP_INFO_SELECTOR)).toBeInTheDocument()
  })

  it('renders the table-cell badge look when tinted', () => {
    const { container } = render(
      <StatusChip
        label={REPLICATING_LABEL}
        tinted
        variant={STATUS_VARIANTS.INFO}
      />
    )

    const chip = container.querySelector(CHIP_INFO_SELECTOR)
    expect(chip?.className).toContain('tinted')
    expect(container.querySelector('[class*="dotInfo"]')).toBeInTheDocument()
  })

  it('does not apply the tinted badge look by default', () => {
    const { container } = render(
      <StatusChip
        label={REPLICATING_LABEL}
        variant={STATUS_VARIANTS.INFO}
      />
    )

    expect(
      container.querySelector(CHIP_INFO_SELECTOR)?.className
    ).not.toContain('tinted')
  })

  it('does not tint the pill background when a custom color overrides the variant', () => {
    const { container } = render(
      <StatusChip
        color='#123456'
        label='Custom'
        variant={STATUS_VARIANTS.UP}
      />
    )

    expect(container.querySelector('[class*="chipUp"]')).not.toBeInTheDocument()
  })

  it('applies a custom color, overriding the variant palette', () => {
    const { container } = render(
      <StatusChip
        color='#123456'
        label='Custom'
        variant={STATUS_VARIANTS.UP}
      />
    )

    const dot = container.querySelector('[class*="dot"]') as HTMLElement
    expect(dot).toHaveStyle({ backgroundColor: '#123456' })
    expect(dot.className).not.toContain('dotUp')
  })

  it('renders the count badge when count is provided', () => {
    render(
      <StatusChip
        count={7}
        label='Running'
      />
    )

    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('does not render a count badge when count is omitted', () => {
    render(<StatusChip label='Running' />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('renders the count badge even when count is zero', () => {
    render(
      <StatusChip
        count={0}
        label='Running'
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('applies the selected class when selected', () => {
    const { container } = render(
      <StatusChip
        label='Running'
        selected
      />
    )

    expect(container.querySelector('[class*="selected"]')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <StatusChip
        label='Running'
        onClick={onClick}
      />
    )

    fireEvent.click(screen.getByText('Running'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

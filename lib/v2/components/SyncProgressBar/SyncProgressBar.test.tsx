import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SYNC_FILL_COLORS, SyncProgressBar } from './SyncProgressBar'

const getFill = (container: HTMLElement) =>
  container.querySelector('[class*="fill"]') as HTMLElement

describe('SyncProgressBar', () => {
  it('sets the fill width to the given percent', () => {
    const { container } = render(<SyncProgressBar percent={42} />)

    expect(getFill(container)).toHaveStyle({ width: '42%' })
  })

  it('clamps the fill width at 100% for percentages over 100', () => {
    const { container } = render(<SyncProgressBar percent={150} />)

    expect(getFill(container)).toHaveStyle({ width: '100%' })
  })

  it('clamps the fill width at 0% for negative percentages', () => {
    const { container } = render(<SyncProgressBar percent={-10} />)

    expect(getFill(container)).toHaveStyle({ width: '0%' })
  })

  it('fills purple by default', () => {
    const { container } = render(<SyncProgressBar percent={42} />)

    expect(getFill(container).className).toContain('fillPurple')
  })

  it('applies the requested fill color', () => {
    const { container } = render(
      <SyncProgressBar
        fillColor={SYNC_FILL_COLORS.RED}
        percent={42}
      />
    )

    expect(getFill(container).className).toContain('fillRed')
    expect(getFill(container).className).not.toContain('fillPurple')
  })

  it('keeps an empty caption slot when caption is omitted', () => {
    render(<SyncProgressBar percent={42} />)

    const caption = screen.getByTestId('sync-progress-bar-caption')

    expect(caption).toBeInTheDocument()
    expect(caption).toBeEmptyDOMElement()
  })

  it('renders a plain string caption', () => {
    render(
      <SyncProgressBar
        caption='42%'
        percent={42}
      />
    )

    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('renders a composed caption without assuming a throughput field exists', () => {
    render(
      <SyncProgressBar
        percent={42}
        caption={
          <>
            <span>42%</span>
            <span>366 MiB/s</span>
          </>
        }
      />
    )

    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(screen.getByText('366 MiB/s')).toBeInTheDocument()
  })

  it('applies extraClass to the container', () => {
    const { container } = render(
      <SyncProgressBar
        extraClass='custom-class'
        percent={42}
      />
    )

    expect((container.firstChild as HTMLElement).className).toContain(
      'custom-class'
    )
  })
})

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SEVERITY_TYPES } from '../../utils/consts'

import {
  ALERT_BADGE_TEST_IDS,
  ALERT_BADGE_VARIANTS,
  AlertBadge
} from './AlertBadge'

describe('AlertBadge - iconWithNumber variant (default)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with count and severity', () => {
    render(
      <AlertBadge
        count={5}
        severity={SEVERITY_TYPES.CRITICAL}
      />
    )
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders with default count of 0', () => {
    render(<AlertBadge severity={SEVERITY_TYPES.MAJOR} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('displays "9+" when count exceeds 9', () => {
    render(
      <AlertBadge
        count={10}
        severity={SEVERITY_TYPES.MINOR}
      />
    )
    expect(screen.getByText('9+')).toBeInTheDocument()
  })

  it('displays exact count when count is 9 or less', () => {
    render(
      <AlertBadge
        count={9}
        severity={SEVERITY_TYPES.INFO}
      />
    )
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('applies default data-testid', () => {
    render(
      <AlertBadge
        count={3}
        severity={SEVERITY_TYPES.CRITICAL}
      />
    )
    expect(
      screen.getByTestId(ALERT_BADGE_TEST_IDS.ICON_WITH_NUMBER)
    ).toBeInTheDocument()
  })

  it('applies custom data-testid with suffix', () => {
    render(
      <AlertBadge
        count={3}
        dataTestId='custom'
        severity={SEVERITY_TYPES.CRITICAL}
      />
    )
    expect(screen.getByTestId('custom-icon-with-number')).toBeInTheDocument()
  })
})

describe('AlertBadge - iconOnly variant', () => {
  it('renders only the icon without count', () => {
    render(
      <AlertBadge
        severity={SEVERITY_TYPES.CRITICAL}
        variant={ALERT_BADGE_VARIANTS.ICON_ONLY}
      />
    )
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('applies default data-testid for iconOnly', () => {
    render(
      <AlertBadge
        severity={SEVERITY_TYPES.MAJOR}
        variant={ALERT_BADGE_VARIANTS.ICON_ONLY}
      />
    )
    expect(
      screen.getByTestId(ALERT_BADGE_TEST_IDS.ICON_ONLY)
    ).toBeInTheDocument()
  })

  it('applies custom data-testid with iconOnly suffix', () => {
    render(
      <AlertBadge
        dataTestId='custom'
        severity={SEVERITY_TYPES.MINOR}
        variant={ALERT_BADGE_VARIANTS.ICON_ONLY}
      />
    )
    expect(screen.getByTestId('custom-icon-only')).toBeInTheDocument()
  })
})

describe('AlertBadge - Styling', () => {
  it('applies severity class to badge', () => {
    const { container } = render(
      <AlertBadge
        count={3}
        severity={SEVERITY_TYPES.CRITICAL}
      />
    )
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('critical')
    expect(badge.className).toContain('alertBadge')
  })

  it('applies iconWithNumber class by default', () => {
    const { container } = render(
      <AlertBadge
        count={3}
        severity={SEVERITY_TYPES.MAJOR}
      />
    )
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('iconWithNumber')
  })

  it('applies iconOnly class for iconOnly variant', () => {
    const { container } = render(
      <AlertBadge
        severity={SEVERITY_TYPES.MINOR}
        variant={ALERT_BADGE_VARIANTS.ICON_ONLY}
      />
    )
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('iconOnly')
  })

  it('applies iconWithTwoNumbers class when count exceeds 9', () => {
    const { container } = render(
      <AlertBadge
        count={15}
        severity={SEVERITY_TYPES.WARNING}
      />
    )
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('iconWithTwoNumbers')
  })

  it('does not apply iconWithTwoNumbers class when count is 9 or less', () => {
    const { container } = render(
      <AlertBadge
        count={9}
        severity={SEVERITY_TYPES.INFO}
      />
    )
    const badge = container.firstChild as HTMLElement
    expect(badge.className).not.toContain('iconWithTwoNumbers')
  })
})

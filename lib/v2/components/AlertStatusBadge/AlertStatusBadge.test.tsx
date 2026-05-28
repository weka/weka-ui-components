import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import { AlertStatusBadge } from './AlertStatusBadge'

describe('AlertStatusBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with default severity', () => {
      render(<AlertStatusBadge severity={SEVERITY_TYPES.DEFAULT} />)
      expect(screen.getByText('Info')).toBeInTheDocument()
    })

    it('renders an SVG icon', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders startTime when provided', () => {
      render(
        <AlertStatusBadge
          severity={SEVERITY_TYPES.MAJOR}
          startTime='2 hours ago'
        />
      )
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
    })

    it('does not render time element when startTime is not provided', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.MINOR} />
      )
      const timeElements = container.querySelectorAll(
        '[class*="statusTime"]'
      )
      expect(timeElements).toHaveLength(0)
    })
  })

  describe('Severity Labels', () => {
    it.each([
      { severity: SEVERITY_TYPES.CRITICAL, expectedLabel: 'Critical' },
      { severity: SEVERITY_TYPES.MAJOR, expectedLabel: 'Major' },
      { severity: SEVERITY_TYPES.MINOR, expectedLabel: 'Minor' },
      { severity: SEVERITY_TYPES.WARNING, expectedLabel: 'Warning' },
      { severity: SEVERITY_TYPES.INFO, expectedLabel: 'Info' },
      { severity: SEVERITY_TYPES.DEBUG, expectedLabel: 'Debug' },
      { severity: SEVERITY_TYPES.DEFAULT, expectedLabel: 'Info' }
    ])(
      'renders "$expectedLabel" label for $severity severity',
      ({ severity, expectedLabel }) => {
        render(<AlertStatusBadge severity={severity} />)
        expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      }
    )
  })

  describe('Styling', () => {
    it('applies severity-specific class to the badge container', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('critical')
    })

    it('applies statusBadge class to container', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.MAJOR} />
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('statusBadge')
    })

    it('applies small class when size is small', () => {
      const { container } = render(
        <AlertStatusBadge
          severity={SEVERITY_TYPES.CRITICAL}
          size='small'
        />
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('small')
    })

    it('applies large class when size is large (default)', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('large')
    })
  })

  describe('Fallback Behavior', () => {
    it('falls back to default config for unsupported severity', () => {
      render(<AlertStatusBadge severity={'unsupported' as never} />)
      expect(screen.getByText('Info')).toBeInTheDocument()
    })

    it('accepts loose severity strings via normalizeSeverity', () => {
      render(<AlertStatusBadge severity='CRITICAL' />)
      expect(screen.getByText('Critical')).toBeInTheDocument()
    })
  })
})

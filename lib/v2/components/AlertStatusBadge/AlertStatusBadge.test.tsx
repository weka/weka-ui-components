import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SEVERITY_TYPES } from '../../utils/consts'

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

    it('renders SVG icon', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('viewBox', '0 0 54 54')
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
      const timeElements = container.querySelectorAll('[class*="time"]')
      expect(timeElements).toHaveLength(0)
    })
  })

  describe('Severity Labels', () => {
    it.each([
      { severity: SEVERITY_TYPES.CRITICAL, expectedLabel: 'Critical' },
      { severity: SEVERITY_TYPES.MAJOR, expectedLabel: 'Major' },
      { severity: SEVERITY_TYPES.MINOR, expectedLabel: 'Minor' },
      { severity: SEVERITY_TYPES.WARNING, expectedLabel: 'Warning' },
      { severity: SEVERITY_TYPES.DEFAULT, expectedLabel: 'Info' }
    ])(
      'renders "$expectedLabel" label for $severity severity',
      ({ severity, expectedLabel }) => {
        render(<AlertStatusBadge severity={severity} />)
        expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      }
    )
  })

  describe('Gradient Colors', () => {
    it('renders gradient stops', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />
      )
      const stops = container.querySelectorAll('stop')
      expect(stops).toHaveLength(2)
    })

    it('creates unique gradient ID per severity', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />
      )
      const gradient = container.querySelector('linearGradient')
      expect(gradient).toHaveAttribute('id', 'alert-criticalGradient-triangle')
    })
  })

  describe('Styling', () => {
    it('applies severity-specific class to label', () => {
      render(<AlertStatusBadge severity={SEVERITY_TYPES.CRITICAL} />)
      const label = screen.getByText('Critical')
      expect(label.className).toContain('critical')
    })

    it('applies badge class to container', () => {
      const { container } = render(
        <AlertStatusBadge severity={SEVERITY_TYPES.MAJOR} />
      )
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('badge')
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
  })

  describe('Fallback Behavior', () => {
    it('falls back to default config for unsupported severity', () => {
      render(<AlertStatusBadge severity={'unsupported' as never} />)
      expect(screen.getByText('Info')).toBeInTheDocument()
    })

    it('falls back to default config for info severity', () => {
      render(<AlertStatusBadge severity={SEVERITY_TYPES.INFO} />)
      expect(screen.getByText('Info')).toBeInTheDocument()
    })

    it('falls back to default config for debug severity', () => {
      render(<AlertStatusBadge severity={SEVERITY_TYPES.DEBUG} />)
      expect(screen.getByText('Info')).toBeInTheDocument()
    })
  })
})

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SystemStatus } from './SystemStatus'

const FULLY_PROTECTED = 'Fully Protected'
const PARTIALLY_PROTECTED = 'Partially Protected'

describe('SystemStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with data-testid', () => {
      render(<SystemStatus status={FULLY_PROTECTED} />)
      expect(screen.getByTestId('cluster-status')).toBeInTheDocument()
    })

    it('renders status indicator circle', () => {
      const { container } = render(<SystemStatus status={FULLY_PROTECTED} />)
      const circle = container.querySelector('[class*="circle"]')
      expect(circle).toBeInTheDocument()
    })

    it('renders status text', () => {
      render(<SystemStatus status={FULLY_PROTECTED} />)
      expect(screen.getByText(FULLY_PROTECTED)).toBeInTheDocument()
    })
  })

  describe('Status Labels', () => {
    it.each([
      { status: FULLY_PROTECTED, expectedLabel: FULLY_PROTECTED },
      {
        status: PARTIALLY_PROTECTED,
        expectedLabel: PARTIALLY_PROTECTED
      },
      { status: 'Unprotected', expectedLabel: 'Unprotected' },
      { status: 'Unavailable', expectedLabel: 'Unavailable' }
    ])(
      'renders "$expectedLabel" for status "$status"',
      ({ status, expectedLabel }) => {
        render(<SystemStatus status={status} />)
        expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      }
    )
  })

  describe('Status Colors', () => {
    it('applies success class for Fully Protected', () => {
      const { container } = render(<SystemStatus status={FULLY_PROTECTED} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('success')
    })

    it('applies warning class for Partially Protected', () => {
      const { container } = render(
        <SystemStatus status={PARTIALLY_PROTECTED} />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('warning')
    })

    it('applies error class for Unprotected', () => {
      const { container } = render(<SystemStatus status='Unprotected' />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('error')
    })

    it('applies info class for Unavailable', () => {
      const { container } = render(<SystemStatus status='Unavailable' />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('info')
    })
  })

  describe('Progress Display', () => {
    it('does not show progress by default', () => {
      render(
        <SystemStatus
          progress={50}
          status={FULLY_PROTECTED}
        />
      )
      expect(screen.queryByText('50.0%')).not.toBeInTheDocument()
    })

    it('shows progress when showProgress is true and progress is provided', () => {
      render(
        <SystemStatus
          progress={75.5}
          showProgress
          status={FULLY_PROTECTED}
        />
      )
      expect(screen.getByText('75.5%')).toBeInTheDocument()
    })

    it('does not show progress when showProgress is true but progress is undefined', () => {
      const { container } = render(
        <SystemStatus
          showProgress
          status={FULLY_PROTECTED}
        />
      )
      const progressElement = container.querySelector('[class*="progress"]')
      expect(progressElement).not.toBeInTheDocument()
    })

    it('formats progress with one decimal place', () => {
      render(
        <SystemStatus
          progress={33.333}
          showProgress
          status={FULLY_PROTECTED}
        />
      )
      expect(screen.getByText('33.3%')).toBeInTheDocument()
    })

    it('shows 0.0% for zero progress', () => {
      render(
        <SystemStatus
          progress={0}
          showProgress
          status={FULLY_PROTECTED}
        />
      )
      expect(screen.getByText('0.0%')).toBeInTheDocument()
    })
  })

  describe('Custom StatusInfo', () => {
    it('uses provided statusInfo instead of mapping from status', () => {
      render(
        <SystemStatus
          status={FULLY_PROTECTED}
          statusInfo={{ label: 'Custom Label', color: 'orange' }}
        />
      )
      expect(screen.getByText('Custom Label')).toBeInTheDocument()
    })

    it('applies color from statusInfo', () => {
      const { container } = render(
        <SystemStatus
          status={FULLY_PROTECTED}
          statusInfo={{ label: 'Custom', color: 'red' }}
        />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('error')
    })
  })

  describe('Styling', () => {
    it('applies systemStatus class to container', () => {
      const { container } = render(<SystemStatus status={FULLY_PROTECTED} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('systemStatus')
    })

    it('applies extraClass when provided', () => {
      const { container } = render(
        <SystemStatus
          extraClass='custom-class'
          status={FULLY_PROTECTED}
        />
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-class')
    })

    it('applies text class to status label', () => {
      render(<SystemStatus status={FULLY_PROTECTED} />)
      const text = screen.getByText(FULLY_PROTECTED)
      expect(text.className).toContain('text')
    })
  })
})

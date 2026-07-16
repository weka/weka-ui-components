import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING, SEVERITY_TYPES } from '#v2/utils/consts'

import { AlertDetails, type AlertDetailsData } from './AlertDetails'

const ALERT_TIMESTAMP = '2024-01-15T10:30:00Z'
const STATUS_ROW_SELECTOR = '[class*="statusRow"]'

const createAlert = (
  overrides: Partial<AlertDetailsData> = {}
): AlertDetailsData => ({
  title: 'Test Alert',
  content: 'Test alert content',
  severity: SEVERITY_TYPES.CRITICAL,
  timestamp: ALERT_TIMESTAMP,
  type: 'system',
  ...overrides
})

describe('AlertDetails', () => {
  describe('rendering', () => {
    it('renders the container', () => {
      const { container } = render(<AlertDetails alert={createAlert()} />)

      expect((container.firstChild as HTMLElement).className).toContain(
        'container'
      )
    })

    it('shows the Active status chip without a Status label', () => {
      render(<AlertDetails alert={createAlert()} />)

      expect(screen.queryByText('Status')).not.toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders the Closed status chip when status is closed', () => {
      render(
        <AlertDetails
          alert={createAlert()}
          status='closed'
        />
      )

      expect(screen.getByText('Closed')).toBeInTheDocument()
    })

    it('hides the status chip when showStatus is false', () => {
      render(
        <AlertDetails
          alert={createAlert()}
          showStatus={false}
        />
      )

      expect(screen.queryByText('Active')).not.toBeInTheDocument()
    })

    it('displays the Type section', () => {
      render(<AlertDetails alert={createAlert({ type: 'custom' })} />)

      expect(screen.getByText('Type')).toBeInTheDocument()
      expect(screen.getByText('custom')).toBeInTheDocument()
    })

    it('displays the Description section', () => {
      render(
        <AlertDetails alert={createAlert({ content: 'Alert description' })} />
      )

      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Alert description')).toBeInTheDocument()
    })
  })

  describe('start time', () => {
    it('renders the timestamp as-is by default', () => {
      render(
        <AlertDetails alert={createAlert({ timestamp: ALERT_TIMESTAMP })} />
      )

      expect(screen.getByText('Start time')).toBeInTheDocument()
      expect(screen.getByText(ALERT_TIMESTAMP)).toBeInTheDocument()
    })

    it('formats the timestamp with the provided formatter', () => {
      render(
        <AlertDetails
          alert={createAlert()}
          formatTimestamp={() => 'Jan 15, 2024'}
        />
      )

      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    })
  })

  describe('severity', () => {
    it('applies the severity class to the status row', () => {
      const { container } = render(
        <AlertDetails alert={createAlert({ severity: SEVERITY_TYPES.MAJOR })} />
      )

      const statusRow = container.querySelector(STATUS_ROW_SELECTOR)
      expect(statusRow?.className).toContain('major')
    })

    it('falls back to the default severity when severity is empty', () => {
      const { container } = render(
        <AlertDetails alert={createAlert({ severity: EMPTY_STRING })} />
      )

      const statusRow = container.querySelector(STATUS_ROW_SELECTOR)
      expect(statusRow?.className).toContain('default')
    })
  })

  describe('related alerts', () => {
    it('displays the related-alerts count when count > 1', () => {
      render(<AlertDetails alert={createAlert({ count: 5 })} />)

      expect(screen.getByText('Related Alerts')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('does not display the related-alerts count when count is 1', () => {
      render(<AlertDetails alert={createAlert({ count: 1 })} />)

      expect(screen.queryByText('Related Alerts')).not.toBeInTheDocument()
    })

    it('displays the related-alerts table when groupedAlerts has multiple items', () => {
      const groupedAlerts = [
        { content: 'Alert 1', timestamp: ALERT_TIMESTAMP },
        { content: 'Alert 2', timestamp: '2024-01-15T11:30:00Z' }
      ]
      render(<AlertDetails alert={createAlert({ groupedAlerts })} />)

      expect(screen.getByText('Related Alerts [2]')).toBeInTheDocument()
    })

    it('does not display the related-alerts table when groupedAlerts has one item', () => {
      const groupedAlerts = [{ content: 'Alert 1', timestamp: ALERT_TIMESTAMP }]
      render(<AlertDetails alert={createAlert({ groupedAlerts })} />)

      expect(screen.queryByText(/Related Alerts \[/)).not.toBeInTheDocument()
    })
  })

  describe('muted state', () => {
    it('shows Yes when the alert is muted', () => {
      render(<AlertDetails alert={createAlert({ muted: true })} />)

      expect(screen.getByText('Muted')).toBeInTheDocument()
      expect(screen.getByText('Yes')).toBeInTheDocument()
    })

    it('shows No when the alert is not muted', () => {
      render(<AlertDetails alert={createAlert({ muted: false })} />)

      expect(screen.getByText('Muted')).toBeInTheDocument()
      expect(screen.getByText('No')).toBeInTheDocument()
    })
  })

  describe('recommended action', () => {
    it('displays the recommended action when provided', () => {
      render(
        <AlertDetails alert={createAlert({ action: 'Restart the service' })} />
      )

      expect(screen.getByText('Recommended Action')).toBeInTheDocument()
      expect(screen.getByText('Restart the service')).toBeInTheDocument()
    })

    it('does not display the recommended-action section when not provided', () => {
      render(<AlertDetails alert={createAlert({ action: undefined })} />)

      expect(screen.queryByText('Recommended Action')).not.toBeInTheDocument()
    })
  })

  describe('banner size', () => {
    it('renders a large banner by default', () => {
      const { container } = render(<AlertDetails alert={createAlert()} />)

      const statusRow = container.querySelector(STATUS_ROW_SELECTOR)
      expect(statusRow?.className).not.toContain('compact')
    })

    it('renders a compact banner when bannerSize is small', () => {
      const { container } = render(
        <AlertDetails
          alert={createAlert()}
          bannerSize='small'
        />
      )

      const statusRow = container.querySelector(STATUS_ROW_SELECTOR)
      expect(statusRow?.className).toContain('compact')
    })
  })

  describe('labels', () => {
    it('applies custom labels', () => {
      render(
        <AlertDetails
          alert={createAlert()}
          labels={{ description: 'Details' }}
        />
      )

      expect(screen.getByText('Details')).toBeInTheDocument()
    })
  })
})

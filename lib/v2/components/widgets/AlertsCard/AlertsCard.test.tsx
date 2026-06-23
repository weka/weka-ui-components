import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AlertsCard } from './AlertsCard'
import { type AlertItem } from './alertsCardUtils'

const fixedTime = () => 'just now'

const DRIVE_FAILED = 'Drive failed'
const DEBUG_NOISE = 'Verbose debug noise'
const MUTED_REBOOT = 'Muted reboot'
const CUSTOM_SNAPSHOT = 'Custom snapshot done'

const alerts: AlertItem[] = [
  {
    id: 1,
    severity: 'critical',
    title: DRIVE_FAILED,
    timestamp: '2026-06-23T09:00:00Z',
    type: 'DRIVE_FAILED'
  },
  {
    id: 2,
    severity: 'debug',
    title: DEBUG_NOISE,
    timestamp: '2026-06-23T08:00:00Z',
    type: 'DEBUG_THING'
  },
  {
    id: 3,
    severity: 'minor',
    title: MUTED_REBOOT,
    timestamp: '2026-06-23T07:00:00Z',
    type: 'NODE_REBOOT',
    muted: true
  },
  {
    id: 4,
    severity: 'info',
    title: CUSTOM_SNAPSHOT,
    timestamp: '2026-06-23T06:00:00Z',
    type: 'custom'
  }
]

const renderCard = (props = {}) =>
  render(
    <AlertsCard
      alerts={alerts}
      formatTimestamp={fixedTime}
      {...props}
    />
  )

describe('AlertsCard', () => {
  it('renders non-muted system alerts and hides debug-severity ones', () => {
    renderCard()
    expect(screen.getByText(DRIVE_FAILED)).toBeInTheDocument()
    expect(screen.queryByText(DEBUG_NOISE)).not.toBeInTheDocument()
  })

  it('hides muted alerts by default and shows them when showMuted is set', () => {
    const { rerender } = renderCard()
    expect(screen.queryByText(MUTED_REBOOT)).not.toBeInTheDocument()

    rerender(
      <AlertsCard
        alerts={alerts}
        formatTimestamp={fixedTime}
        showMuted
      />
    )
    expect(screen.getByText(MUTED_REBOOT)).toBeInTheDocument()
  })

  it('renders an occurrence count chip for grouped alerts', () => {
    const grouped: AlertItem[] = [
      {
        id: 10,
        severity: 'major',
        title: 'Capacity high',
        timestamp: '2026-06-23T09:00:00Z',
        type: 'FS_CAPACITY'
      },
      {
        id: 11,
        severity: 'major',
        title: 'Capacity high',
        timestamp: '2026-06-23T08:00:00Z',
        type: 'FS_CAPACITY'
      }
    ]
    render(
      <AlertsCard
        alerts={grouped}
        formatTimestamp={fixedTime}
      />
    )
    expect(screen.getByText('[2]')).toBeInTheDocument()
  })

  it('shows system alerts on the System tab and filters to custom-type on the Custom tab', () => {
    renderCard()
    expect(screen.getByText(DRIVE_FAILED)).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('table-tab-CUSTOM'))
    expect(screen.getByText(CUSTOM_SNAPSHOT)).toBeInTheDocument()
    expect(screen.queryByText(DRIVE_FAILED)).not.toBeInTheDocument()
  })

  it('calls onAlertClick when a row is clicked', () => {
    const onAlertClick = vi.fn()
    renderCard({ onAlertClick })
    fireEvent.click(screen.getByText(DRIVE_FAILED))
    expect(onAlertClick).toHaveBeenCalledTimes(1)
    expect(onAlertClick).toHaveBeenCalledWith(
      expect.objectContaining({ title: DRIVE_FAILED })
    )
  })

  it('renders without tabs and shows all alerts when showTabs is false', () => {
    renderCard({ showTabs: false, showMuted: true })
    expect(screen.queryByTestId('table-tab-SYSTEM')).not.toBeInTheDocument()
    expect(screen.queryByTestId('table-tab-CUSTOM')).not.toBeInTheDocument()
    expect(screen.getByText(DRIVE_FAILED)).toBeInTheDocument()
    expect(screen.getByText(CUSTOM_SNAPSHOT)).toBeInTheDocument()
  })

  it('shows the empty message when there are no alerts', () => {
    render(
      <AlertsCard
        alerts={[]}
        formatTimestamp={fixedTime}
      />
    )
    expect(screen.getByText('No System Alerts')).toBeInTheDocument()
  })
})

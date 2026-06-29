import type { Meta, StoryObj } from '@storybook/react'

import {
  getHealthIconType,
  getProtectionTooltip,
  PROGRESS_STATUS_TYPES,
  PROTECTION_STATUS_MAP,
  PROTECTION_STATUS_TYPES,
  type ProtectionStatusType
} from '#v2/utils/protectionStatus'

import { HealthStatus } from './HealthStatus'

const meta: Meta<typeof HealthStatus> = {
  title: 'v2/HealthStatus',
  component: HealthStatus,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthStatus>

const SAMPLE_PROGRESS = 34.5

const columnStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
  width: '242px'
}

const STATUS_ORDER: ProtectionStatusType[] = [
  PROTECTION_STATUS_TYPES.UNPROTECTED,
  PROTECTION_STATUS_TYPES.FULLY_PROTECTED,
  PROTECTION_STATUS_TYPES.REDISTRIBUTING,
  PROTECTION_STATUS_TYPES.REBUILDING,
  PROTECTION_STATUS_TYPES.PARTIALLY_PROTECTED,
  PROTECTION_STATUS_TYPES.PERFORMANCE_DEGRADATION,
  PROTECTION_STATUS_TYPES.IO_STOPPED,
  PROTECTION_STATUS_TYPES.UNINITIALIZED
]

export const AllStatuses: Story = {
  render: () => (
    <div style={columnStyle}>
      {STATUS_ORDER.map((key) => {
        const info = PROTECTION_STATUS_MAP[key]
        return (
          <HealthStatus
            key={key}
            iconType={getHealthIconType(info)}
            label={info.label}
            severity={info.severity}
            tooltipTitle={getProtectionTooltip(info)}
            progress={
              PROGRESS_STATUS_TYPES.includes(key) ? SAMPLE_PROGRESS : undefined
            }
          />
        )
      })}
    </div>
  )
}

const PROGRESS_BAR_STATUSES: ProtectionStatusType[] = [
  PROTECTION_STATUS_TYPES.REDISTRIBUTING,
  PROTECTION_STATUS_TYPES.REBUILDING
]

export const ProgressBarColors: Story = {
  render: () => (
    <div style={columnStyle}>
      {PROGRESS_BAR_STATUSES.map((key) => {
        const info = PROTECTION_STATUS_MAP[key]
        return (
          <HealthStatus
            key={key}
            iconType={getHealthIconType(info)}
            label={info.label}
            severity={info.severity}
            tooltipTitle={getProtectionTooltip(info)}
            progress={SAMPLE_PROGRESS}
          />
        )
      })}
    </div>
  )
}

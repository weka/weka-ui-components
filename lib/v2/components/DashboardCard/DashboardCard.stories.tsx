import type { Meta, StoryObj } from '@storybook/react'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import { LinkIcon, SettingsIcon } from '../../icons'
import { DashboardCard } from './DashboardCard'

const meta: Meta<typeof DashboardCard> = {
  title: 'v2/DashboardCard',
  component: DashboardCard,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof DashboardCard>

const cardStyle = { width: '400px' }
const framedWrapperStyle = {
  width: '400px',
  border: '1px solid var(--gray-300-700)'
}
const contentTextStyle = { color: 'var(--text-primary)' }
const iconBtnStyle = {
  background: 'none',
  border: 'none',
  padding: '0',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--text-secondary)'
}

export const Default: Story = {
  render: () => (
    <div style={cardStyle}>
      <DashboardCard title='Storage Overview'>
        <div style={contentTextStyle}>Chart or content goes here</div>
      </DashboardCard>
    </div>
  )
}

export const WithTooltip: Story = {
  render: () => (
    <div style={cardStyle}>
      <DashboardCard
        title='Capacity'
        tooltip='Shows total and used capacity across all filesystems'
      >
        <div style={contentTextStyle}>Content</div>
      </DashboardCard>
    </div>
  )
}

export const WithSeverityBadge: Story = {
  render: () => (
    <div style={cardStyle}>
      <DashboardCard
        count={3}
        severity={SEVERITY_TYPES.CRITICAL}
        title='Alerts'
        tooltip='Recent alerts and notifications'
      >
        <div style={contentTextStyle}>Content</div>
      </DashboardCard>
    </div>
  )
}

export const FitContent: Story = {
  render: () => (
    <div style={cardStyle}>
      <DashboardCard
        fitContent
        title='Filesystem Capacity'
      >
        <div style={contentTextStyle}>Compact summary content</div>
      </DashboardCard>
    </div>
  )
}

export const Frameless: Story = {
  render: () => (
    <div style={framedWrapperStyle}>
      <DashboardCard
        frameless
        title='Pane Inside A Shared Frame'
      >
        <div style={contentTextStyle}>No own border or shadow</div>
      </DashboardCard>
    </div>
  )
}

export const FullFeatured: Story = {
  render: () => (
    <div style={cardStyle}>
      <DashboardCard
        count={5}
        severity={SEVERITY_TYPES.WARNING}
        subtitle='Last 24 hours'
        title='Alerts'
        tooltip='Recent alerts and notifications'
        actions={
          <>
            <button
              style={iconBtnStyle}
              type='button'
            >
              <SettingsIcon
                height={16}
                width={16}
              />
            </button>
            <button
              style={iconBtnStyle}
              type='button'
            >
              <LinkIcon
                height={16}
                width={16}
              />
            </button>
          </>
        }
      >
        <div style={contentTextStyle}>Chart or widget content</div>
      </DashboardCard>
    </div>
  )
}

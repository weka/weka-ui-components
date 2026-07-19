import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { NOOP, SEVERITY_TYPES } from '#v2/utils/consts'

import { AlertBannerItem } from './AlertBannerItem'
import { ALERT_BANNER_SEVERITY, type AlertBannerItemData } from './types'

const meta: Meta<typeof AlertBannerItem> = {
  title: 'v2/AlertBannerItem',
  component: AlertBannerItem,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertBannerItem>

const COLUMN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'flex-start'
}

const ITEMS: AlertBannerItemData[] = [
  {
    id: 'critical',
    severity: SEVERITY_TYPES.CRITICAL,
    boldPrefix: 'Support -',
    message: 'your cluster Production license has expired.',
    linkText: 'Renew',
    linkUrl: '#',
    closable: true
  },
  {
    id: 'major',
    severity: SEVERITY_TYPES.MAJOR,
    message: 'Node 3 is unreachable.',
    closable: true
  },
  {
    id: 'minor',
    severity: SEVERITY_TYPES.MINOR,
    message: 'Rebuild in progress on filesystem default.',
    closable: true
  },
  {
    id: 'warning',
    severity: SEVERITY_TYPES.WARNING,
    message: 'Capacity is above 80%.',
    closable: true
  },
  {
    id: 'info',
    severity: SEVERITY_TYPES.INFO,
    message: 'A maintenance window is scheduled for Sunday.',
    closable: true
  },
  {
    id: 'success',
    severity: ALERT_BANNER_SEVERITY.SUCCESS,
    message: 'Cluster upgrade completed successfully.'
  }
]

export const AllSeverities: Story = {
  render: () => (
    <div style={COLUMN_STYLE}>
      {ITEMS.map((item) => (
        <AlertBannerItem
          key={item.id}
          item={item}
          onDismiss={NOOP}
        />
      ))}
    </div>
  )
}

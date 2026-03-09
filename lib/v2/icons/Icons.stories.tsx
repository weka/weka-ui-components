import type { Meta, StoryObj } from '@storybook/react'

import { ChartIcon } from './ChartIcon'
import { CheckboxCheckedIcon } from './CheckboxCheckedIcon'
import { CheckboxPartialIcon } from './CheckboxPartialIcon'
import { CheckboxUncheckedIcon } from './CheckboxUncheckedIcon'
import { CloseWithBgIcon } from './CloseWithBgIcon'
import { InfoIcon } from './InfoIcon'

const meta: Meta = {
  title: 'v2/Icons'
}

export default meta
type Story = StoryObj

const iconStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px'
}

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
      <div style={iconStyle}>
        <ChartIcon />
        <span>ChartIcon</span>
      </div>
      <div style={iconStyle}>
        <CheckboxCheckedIcon />
        <span>CheckboxChecked</span>
      </div>
      <div style={iconStyle}>
        <CheckboxPartialIcon />
        <span>CheckboxPartial</span>
      </div>
      <div style={iconStyle}>
        <CheckboxUncheckedIcon />
        <span>CheckboxUnchecked</span>
      </div>
      <div style={iconStyle}>
        <CloseWithBgIcon />
        <span>CloseWithBg</span>
      </div>
      <div style={iconStyle}>
        <InfoIcon />
        <span>InfoIcon</span>
      </div>
    </div>
  )
}

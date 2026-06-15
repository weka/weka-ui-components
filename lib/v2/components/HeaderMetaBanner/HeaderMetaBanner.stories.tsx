import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { SwapIcon, VcheckFillIcon } from '../../icons'
import { HeaderMetaBanner } from './HeaderMetaBanner'

const meta: Meta<typeof HeaderMetaBanner> = {
  title: 'v2/HeaderMetaBanner',
  component: HeaderMetaBanner,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HeaderMetaBanner>

const statusChipStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px',
  borderRadius: '20px',
  background: '#268033',
  color: '#fff'
}

const swapButtonStyle: CSSProperties = {
  display: 'flex',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: 'var(--gray-920-50)'
}

const statusChip = (
  <span style={statusChipStyle}>
    <VcheckFillIcon
      fill='currentColor'
      height={14}
      width={14}
    />
  </span>
)

const swapButton = (
  <button
    aria-label='Switch time zone'
    style={swapButtonStyle}
    type='button'
  >
    <SwapIcon />
  </button>
)

export const ClusterMeta: Story = {
  render: () => (
    <HeaderMetaBanner
      leading={statusChip}
      items={[
        { key: 'cluster', label: 'Cluster', value: 'DFW01-PROD-STR-WEK-01' },
        { key: 'tenant', label: 'Tenant', value: 'Tenant_AB3561c_560' },
        {
          key: 'time',
          label: 'Local Time',
          value: '11:45AM',
          trailing: swapButton
        }
      ]}
    />
  )
}

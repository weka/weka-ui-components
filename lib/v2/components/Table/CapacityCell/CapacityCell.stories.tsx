import type { Meta, StoryObj } from '@storybook/react'

import { UNIT_TYPES } from '#v2/utils/capacityUtils'

import { CapacityCell } from './CapacityCell'

const meta: Meta<typeof CapacityCell> = {
  title: 'v2/Table/Cells/CapacityCell'
}

export default meta
type Story = StoryObj<typeof CapacityCell>

interface FilesystemRow {
  name: string
  used: number
  total: number
  unitType?: string
  unlimitedWhenZero?: boolean
  badge?: { label: string; tooltip?: string }
}

const ROWS: FilesystemRow[] = [
  {
    name: 'fs-prod',
    used: 2_600_000_000,
    total: 4_000_000_000,
    badge: {
      label: 'TP',
      tooltip: 'Thinly Provisioned Filesystem\nMax SSD: 4 GB\nMin SSD: 1 GB'
    }
  },
  { name: 'fs-archive', used: 980_000_000, total: 50_000_000_000 },
  { name: 'fs-scratch', used: 3_900_000_000, total: 4_000_000_000 },
  {
    name: 'fs-binary',
    used: 4_187_593_113,
    total: 4_294_967_296,
    unitType: UNIT_TYPES.BASE2_AUTO
  },
  {
    name: 'fs-unbounded',
    used: 500_000_000_000,
    total: 0,
    unlimitedWhenZero: true
  }
]

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)'
}

const TABLE_STYLE = {
  borderCollapse: 'collapse' as const,
  width: '100%',
  fontFamily: "'IBMPlexSans', sans-serif",
  fontSize: '13px',
  color: 'var(--text-primary)'
}

const HEADER_STYLE = {
  textAlign: 'left' as const,
  padding: '8px 12px',
  borderBottom: '1px solid var(--gray-200-800)',
  fontWeight: 600
}

const CELL_STYLE = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--gray-100-900)'
}

const NAME_HEADER_STYLE = { ...HEADER_STYLE, width: 160 }
const CAPACITY_HEADER_STYLE = { ...HEADER_STYLE, width: 280 }

function CapacityCellDemo() {
  return (
    <div style={CONTAINER_STYLE}>
      <table style={TABLE_STYLE}>
        <thead>
          <tr>
            <th style={NAME_HEADER_STYLE}>Name</th>
            <th style={CAPACITY_HEADER_STYLE}>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.name}>
              <td style={CELL_STYLE}>{row.name}</td>
              <td style={CELL_STYLE}>
                <CapacityCell
                  badge={row.badge}
                  total={row.total}
                  unitType={row.unitType}
                  unlimitedWhenZero={row.unlimitedWhenZero}
                  used={row.used}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <CapacityCellDemo />
}

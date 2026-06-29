import type { CapabilitiesCellProps } from './CapabilitiesCell'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColumnDef } from '@tanstack/react-table'

import { CellStoryTable } from '../CellStoryTable'
import { CapabilitiesCell } from './CapabilitiesCell'

const meta: Meta<typeof CapabilitiesCell> = {
  title: 'v2/Table/Cells/CapabilitiesCell',
  component: CapabilitiesCell,
  argTypes: {
    thinlyProvisioned: { control: 'boolean' },
    tiered: { control: 'boolean' },
    encrypted: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof CapabilitiesCell>

export const Playground: Story = {
  args: {
    thinlyProvisioned: true,
    tiered: true,
    encrypted: true
  }
}

export const AllBadges: Story = {
  args: {
    thinlyProvisioned: true,
    tiered: true,
    encrypted: true
  }
}

export const ThinOnly: Story = {
  args: {
    thinlyProvisioned: true
  }
}

export const TierOnly: Story = {
  args: {
    tiered: true
  }
}

export const EncryptedOnly: Story = {
  args: {
    encrypted: true
  }
}

export const ThinAndEncrypted: Story = {
  args: {
    thinlyProvisioned: true,
    encrypted: true
  }
}

export const NoBadges: Story = {
  args: {}
}

interface Row {
  name: string
  thinlyProvisioned: boolean
  tiered: boolean
  encrypted: boolean
}

const SAMPLE_ROWS: Row[] = [
  {
    name: 'default',
    thinlyProvisioned: false,
    tiered: false,
    encrypted: false
  },
  { name: 'thin-fs', thinlyProvisioned: true, tiered: false, encrypted: false },
  {
    name: 'tiered-fs',
    thinlyProvisioned: false,
    tiered: true,
    encrypted: false
  },
  { name: 'enc-fs', thinlyProvisioned: false, tiered: false, encrypted: true },
  {
    name: 'thin-tiered',
    thinlyProvisioned: true,
    tiered: true,
    encrypted: false
  },
  {
    name: 'all-caps',
    thinlyProvisioned: true,
    tiered: true,
    encrypted: true
  }
]

const columns: ColumnDef<Row, CapabilitiesCellProps>[] = [
  {
    accessorKey: 'name',
    header: 'Filesystem',
    size: 140
  },
  {
    id: 'capabilities',
    header: 'Capabilities',
    size: 200,
    cell: ({ row }) => (
      <CapabilitiesCell
        encrypted={row.original.encrypted}
        thinlyProvisioned={row.original.thinlyProvisioned}
        tiered={row.original.tiered}
      />
    )
  }
]

export const InTable: Story = {
  render: () => (
    <CellStoryTable
      columns={columns}
      data={SAMPLE_ROWS}
    />
  )
}

import type { SimpleTableColumn } from './SimpleTable'
import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { ExpandableText } from './ExpandableText'
import { ExpandableTextProvider } from './ExpandableTextContext'
import { SimpleTable } from './SimpleTable'

interface Row {
  id: string
  name: string
  status: string
  value: number
}

interface GroupedAlertRow {
  id: string
  description: string
  timestamp: string
}

const SAMPLE_ROWS: Row[] = [
  { id: '1', name: 'cluster-prod-1', status: 'OK', value: 1240 },
  { id: '2', name: 'cluster-prod-2', status: 'WARNING', value: 870 },
  { id: '3', name: 'cluster-prod-3', status: 'ERROR', value: 0 },
  { id: '4', name: 'cluster-staging-1', status: 'OK', value: 540 },
  { id: '5', name: 'cluster-staging-2', status: 'OK', value: 1080 },
  { id: '6', name: 'cluster-dev-1', status: 'OK', value: 220 }
]

const COLUMNS: SimpleTableColumn<Row>[] = [
  { key: 'name', header: 'Cluster', render: (row) => row.name },
  { key: 'status', header: 'Status', render: (row) => row.status },
  {
    key: 'value',
    header: 'Throughput',
    render: (row) => `${row.value} MB/s`
  }
]

const SHORT_TEXT =
  'Brief alert description that fits in two lines without any clipping.'

const MEDIUM_TEXT =
  'This alert description is long enough that it might overflow the visible row height and trigger the expand chevron to appear next to the row content.'

const LONG_TEXT =
  'This is a substantially longer alert description that definitely exceeds the two-line clamp. The component truncates it to a few lines and adds a chevron so the user can expand to see the full body. When expanded, the row grows to fit the entire text.'

const GROUPED_ALERTS: GroupedAlertRow[] = [
  { id: 'g1', description: SHORT_TEXT, timestamp: '2 minutes ago' },
  { id: 'g2', description: MEDIUM_TEXT, timestamp: '5 minutes ago' },
  { id: 'g3', description: LONG_TEXT, timestamp: '12 minutes ago' }
]

const CONTAINER_STYLE: CSSProperties = {
  width: '640px',
  height: '320px',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)'
}

const EXPANDABLE_CONTAINER_STYLE: CSSProperties = {
  width: '640px',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)'
}

const TABS = [
  { id: 'all', label: 'All clusters' },
  { id: 'prod', label: 'Production' }
]

const EMPTY_STATE_MESSAGE = 'No clusters match the current filter'

const EXPANDABLE_ROW_CLASS = 'story-expandable-row'

const EXPANDABLE_ROW_STYLES = `
  .${EXPANDABLE_ROW_CLASS} {
    min-height: 64px !important;
    height: auto !important;
    align-items: flex-start !important;
    padding: 8px !important;
  }
`

const STORY_VARIANTS = {
  INTERACTIVE: 'interactive',
  EMPTY: 'empty',
  WITH_EXPANDABLE_TEXT: 'expandable'
} as const

type StoryVariant = (typeof STORY_VARIANTS)[keyof typeof STORY_VARIANTS]

const EXPANDABLE_COLUMNS: SimpleTableColumn<GroupedAlertRow>[] = [
  {
    key: 'description',
    header: 'Description',
    render: (row) => <ExpandableText text={row.description} />
  },
  {
    key: 'timestamp',
    header: 'When',
    width: 140,
    render: (row) => row.timestamp
  }
]

function SimpleTableDemo({ variant }: Readonly<{ variant: StoryVariant }>) {
  const [activeTab, setActiveTab] = useState('all')

  if (variant === STORY_VARIANTS.EMPTY) {
    return (
      <div style={CONTAINER_STYLE}>
        <SimpleTable<Row>
          columns={COLUMNS}
          data={[]}
          emptyMessage={EMPTY_STATE_MESSAGE}
        />
      </div>
    )
  }

  if (variant === STORY_VARIANTS.WITH_EXPANDABLE_TEXT) {
    return (
      <div style={EXPANDABLE_CONTAINER_STYLE}>
        <style>{EXPANDABLE_ROW_STYLES}</style>
        <ExpandableTextProvider>
          <SimpleTable<GroupedAlertRow>
            columns={EXPANDABLE_COLUMNS}
            data={GROUPED_ALERTS}
            rowClassName={EXPANDABLE_ROW_CLASS}
          />
        </ExpandableTextProvider>
      </div>
    )
  }

  const filtered =
    activeTab === 'prod'
      ? SAMPLE_ROWS.filter((row) => row.name.includes('prod'))
      : SAMPLE_ROWS

  return (
    <div style={CONTAINER_STYLE}>
      <SimpleTable<Row>
        activeTab={activeTab}
        columns={COLUMNS}
        data={filtered}
        onTabChange={setActiveTab}
        tabs={TABS}
      />
    </div>
  )
}

const meta: Meta<typeof SimpleTableDemo> = {
  title: 'v2/SimpleTable',
  component: SimpleTableDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  args: { variant: STORY_VARIANTS.INTERACTIVE }
}

export const Empty: Story = {
  args: { variant: STORY_VARIANTS.EMPTY }
}

export const WithExpandableText: Story = {
  args: { variant: STORY_VARIANTS.WITH_EXPANDABLE_TEXT }
}

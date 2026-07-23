import type { Tab, TabVariant } from './tabsConstants'
import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { ChartIcon } from '../../icons'
import { Tabs } from './Tabs'
import { TAB_VARIANTS } from './tabsConstants'

const meta: Meta<typeof Tabs> = {
  title: 'v2/Tabs',
  component: Tabs
}

export default meta
type Story = StoryObj<typeof Tabs>

const CONTAINER_STYLE: CSSProperties = {
  width: '760px',
  padding: '16px'
}

const MAX_DASHBOARD_TABS = 5

const BASIC_TABS: Tab[] = [
  { id: 'overview', label: 'Overview', Icon: ChartIcon },
  { id: 'performance', label: 'Performance' },
  { id: 'events', label: 'Events', count: 12 },
  { id: 'settings', label: 'Settings' }
]

const UNDERLINE_TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'alerts', label: 'Alerts', count: 4 },
  { id: 'filesystems', label: 'Filesystems', count: 2, maxCount: 1024 },
  { id: 'audit', label: 'Audit log' }
]

const EDITABLE_TABS: Tab[] = [
  { id: 'dashboard-0', label: 'Capacity' },
  { id: 'dashboard-1', label: 'Latency' }
]

function reorder(list: Tab[], sourceId: string, targetId: string): Tab[] {
  const result = [...list]
  const fromIndex = result.findIndex((tab) => tab.id === sourceId)
  const toIndex = result.findIndex((tab) => tab.id === targetId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return result
  }
  const [moved] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, moved)
  return result
}

let nextDashboardId = 1

function TabsDemo({
  variant,
  initialTabs
}: Readonly<{ variant: TabVariant; initialTabs: Tab[] }>) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs)
  const [activeTab, setActiveTab] = useState(initialTabs[0].id)
  const [newTabId, setNewTabId] = useState<string | null>(null)
  const isEditable = variant === TAB_VARIANTS.EDITABLE

  const handleAddTab = () => {
    const id = `dashboard-new-${nextDashboardId}`
    nextDashboardId += 1
    setTabs((prev) => [...prev, { id, label: 'New dashboard' }])
    setActiveTab(id)
    setNewTabId(id)
  }

  const handleRenameTab = (id: string, label: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, label } : tab))
    )
    setNewTabId(null)
  }

  return (
    <div style={CONTAINER_STYLE}>
      <Tabs
        activeTab={activeTab}
        maxTabs={isEditable ? MAX_DASHBOARD_TABS : undefined}
        minTabs={1}
        newTabId={newTabId}
        onAddTab={isEditable ? handleAddTab : undefined}
        onEditCancelled={() => setNewTabId(null)}
        onRenameTab={isEditable ? handleRenameTab : undefined}
        onTabChange={setActiveTab}
        tabs={tabs}
        variant={variant}
        onDeleteTab={
          isEditable
            ? (id) => setTabs((prev) => prev.filter((tab) => tab.id !== id))
            : undefined
        }
        onReorderTabs={
          isEditable
            ? (sourceId, targetId) =>
                setTabs((prev) => reorder(prev, sourceId, targetId))
            : undefined
        }
      />
    </div>
  )
}

export const Primary: Story = {
  render: () => (
    <TabsDemo
      initialTabs={BASIC_TABS}
      variant={TAB_VARIANTS.PRIMARY}
    />
  )
}

export const Underline: Story = {
  render: () => (
    <TabsDemo
      initialTabs={UNDERLINE_TABS}
      variant={TAB_VARIANTS.UNDERLINE}
    />
  )
}

export const Editable: Story = {
  render: () => (
    <TabsDemo
      initialTabs={EDITABLE_TABS}
      variant={TAB_VARIANTS.EDITABLE}
    />
  )
}

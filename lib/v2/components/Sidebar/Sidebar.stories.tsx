import type { SidebarItem } from './types'
import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import {
  ConfigureIcon,
  InvestigateIcon,
  LogoutIcon,
  ManageIcon,
  MonitorIcon
} from '../../icons'
import { Sidebar } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'v2/Sidebar',
  component: Sidebar,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Sidebar>

const frameStyle = {
  height: '640px',
  display: 'flex'
}
const logoStyle = { color: 'var(--gray-0)', fontWeight: 700 }

const footerItems = [{ key: 'logout', label: 'Log Out', icon: <LogoutIcon /> }]

const items: SidebarItem[] = [
  {
    key: 'monitor',
    label: 'Monitor',
    icon: <MonitorIcon />,
    subItems: [
      {
        key: 'dashboard',
        label: 'System Dashboard',
        href: '/monitor/dashboard'
      },
      { key: 'tasks', label: 'Background Tasks', href: '/monitor/tasks' }
    ]
  },
  {
    key: 'investigate',
    label: 'Investigate',
    icon: <InvestigateIcon />,
    subItems: [
      { key: 'events', label: 'Events', href: '/investigate/events' },
      { key: 'stats', label: 'Statistics', href: '/investigate/stats' }
    ]
  },
  {
    key: 'manage',
    label: 'Manage',
    icon: <ManageIcon />,
    subItems: [{ key: 'fs', label: 'Filesystems', href: '/manage/filesystems' }]
  },
  {
    key: 'configure',
    label: 'Configure',
    icon: <ConfigureIcon />,
    href: '/configure'
  }
]

const clusterNames = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot']

const hybridItems: SidebarItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <MonitorIcon />,
    href: '/dashboard'
  },
  {
    key: 'clusters',
    label: 'Clusters (6)',
    icon: <ManageIcon />,
    href: '/clusters',
    scrollableSubmenu: true,
    subItems: clusterNames.map((name) => ({
      key: name,
      label: name,
      href: `/clusters/${name}`
    }))
  },
  {
    key: 'performance',
    label: 'Performance',
    icon: <InvestigateIcon />,
    href: '/performance'
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <ConfigureIcon />,
    dividerBefore: true,
    subItems: [
      { key: 'general', label: 'General', href: '/settings/general' },
      {
        key: 'notification',
        label: 'Notification',
        href: '/settings/notification'
      }
    ]
  }
]

function SidebarDemo({
  data,
  initialPath
}: Readonly<{
  data: SidebarItem[]
  initialPath: string
}>) {
  const [currentPath, setCurrentPath] = useState(initialPath)
  return (
    <div style={frameStyle}>
      <Sidebar
        currentPath={currentPath}
        defaultExpanded
        footerItems={footerItems}
        items={data}
        logo={<span style={logoStyle}>NeuralMesh</span>}
        logoCollapsed={<span style={logoStyle}>N</span>}
        onNavigate={setCurrentPath}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <SidebarDemo
      data={items}
      initialPath='/monitor/dashboard'
    />
  )
}

export const WithHybridAndDivider: Story = {
  render: () => (
    <SidebarDemo
      data={hybridItems}
      initialPath='/clusters/alpha'
    />
  )
}

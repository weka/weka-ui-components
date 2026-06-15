import type { SidebarItem } from './types'

import { describe, expect, it } from 'vitest'

import { hasSubItems, isItemActive, isPathActive } from './sidebarUtils'

const MONITOR_PATH = '/monitor'
const DASHBOARD_PATH = '/monitor/dashboard'

describe('sidebarUtils', () => {
  describe('isPathActive', () => {
    it('matches a nested child path', () => {
      expect(isPathActive(DASHBOARD_PATH, MONITOR_PATH)).toBe(true)
    })

    it('matches the exact href', () => {
      expect(isPathActive(MONITOR_PATH, MONITOR_PATH)).toBe(true)
    })

    it('does not match a path that only shares a prefix without a boundary', () => {
      expect(isPathActive('/monitoring', MONITOR_PATH)).toBe(false)
    })

    it('is false for a non-matching path', () => {
      expect(isPathActive('/manage', MONITOR_PATH)).toBe(false)
    })

    it('is false when the href is missing', () => {
      expect(isPathActive(MONITOR_PATH)).toBe(false)
    })
  })

  describe('hasSubItems', () => {
    it('is true when the item has sub-items', () => {
      const item: SidebarItem = {
        key: 'monitor',
        label: 'Monitor',
        icon: null,
        subItems: [
          { key: 'dashboard', label: 'Dashboard', href: DASHBOARD_PATH }
        ]
      }
      expect(hasSubItems(item)).toBe(true)
    })

    it('is false for a leaf item', () => {
      const item: SidebarItem = {
        key: 'clusters',
        label: 'Clusters',
        icon: null,
        href: '/clusters'
      }
      expect(hasSubItems(item)).toBe(false)
    })
  })

  describe('isItemActive', () => {
    it('is active when a sub-item href matches', () => {
      const item: SidebarItem = {
        key: 'monitor',
        label: 'Monitor',
        icon: null,
        subItems: [
          { key: 'dashboard', label: 'Dashboard', href: DASHBOARD_PATH }
        ]
      }
      expect(isItemActive(DASHBOARD_PATH, item)).toBe(true)
    })

    it('is active when a leaf href matches', () => {
      const item: SidebarItem = {
        key: 'clusters',
        label: 'Clusters',
        icon: null,
        href: '/clusters'
      }
      expect(isItemActive('/clusters/abc', item)).toBe(true)
    })

    it('is inactive when nothing matches', () => {
      const item: SidebarItem = {
        key: 'manage',
        label: 'Manage',
        icon: null,
        subItems: [{ key: 'fs', label: 'Filesystems', href: '/manage/fs' }]
      }
      expect(isItemActive(MONITOR_PATH, item)).toBe(false)
    })
  })
})

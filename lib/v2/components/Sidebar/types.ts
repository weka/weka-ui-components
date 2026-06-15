import type { ReactNode } from 'react'

export interface SidebarSubItem {
  key: string
  label: string
  /** When omitted, the sub-item renders as a disabled placeholder. */
  href?: string
  badge?: string
  /** SCSS module class name for the badge color variant (e.g. 'critical'). */
  badgeColor?: string
}

export interface SidebarItem {
  key: string
  label: string
  icon: ReactNode
  /** Direct navigation target. */
  href?: string
  /** Custom action for non-navigational items (e.g. logout). */
  onClick?: () => void
  /** Sub-items shown when the sidebar is expanded. */
  subItems?: SidebarSubItem[]
  /** Render the submenu in a scrollable (simplebar) container with scroll-into-view of the active sub-item. */
  scrollableSubmenu?: boolean
  /** Render a separator above this item (e.g. to divide a trailing settings group from the main nav). */
  dividerBefore?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  /** Items pinned to the bottom (e.g. logout). */
  footerItems?: SidebarItem[]
  /** Current route path; used to compute active state. */
  currentPath: string
  /** Called when a navigational item/sub-item is activated. */
  onNavigate: (href: string) => void
  /** Full logo (shown when expanded). */
  logo?: ReactNode
  /** Compact logo (shown when collapsed); falls back to `logo`. */
  logoCollapsed?: ReactNode
  /** Start expanded instead of the collapsed rail. */
  defaultExpanded?: boolean
  /** Class merged onto the sidebar root; use it to override the surface gradient and text color. */
  extraClass?: string
  dataTestId?: string
}

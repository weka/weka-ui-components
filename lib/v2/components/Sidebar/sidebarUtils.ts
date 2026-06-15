import type { SidebarItem } from './types'

export function isPathActive(currentPath: string, href?: string): boolean {
  if (!href) {
    return false
  }
  const boundary = href.endsWith('/') ? href : `${href}/`
  return currentPath === href || currentPath.startsWith(boundary)
}

export function hasSubItems(item: SidebarItem): boolean {
  return Boolean(item.subItems?.length)
}

export function isItemActive(currentPath: string, item: SidebarItem): boolean {
  return (
    isPathActive(currentPath, item.href) ||
    (item.subItems ?? []).some((subItem) => isPathActive(currentPath, subItem.href))
  )
}

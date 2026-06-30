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
    (item.subItems ?? []).some((subItem) =>
      isPathActive(currentPath, subItem.href)
    )
  )
}

/**
 * The key of the first item whose submenu is active for the current path, or
 * `null` when none. Used as the default-open submenu in the accordion so the
 * section matching the route opens until the user manually toggles another.
 */
export function findActiveSubmenuKey(
  items: SidebarItem[],
  currentPath: string
): string | null {
  const activeItem = items.find(
    (item) => hasSubItems(item) && isItemActive(currentPath, item)
  )
  return activeItem?.key ?? null
}

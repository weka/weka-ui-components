export const SCROLL_THRESHOLD = 5
export const CONTAINER_PADDING = 12
export const TAB_SCROLL_OFFSET = 20

export function findFirstVisibleTabIndex(
  sortedTabs: HTMLDivElement[],
  visibleLeft: number
): number {
  for (let i = 0; i < sortedTabs.length; i += 1) {
    const tab = sortedTabs[i]
    const tabLeft = tab.offsetLeft
    if (tabLeft >= visibleLeft - SCROLL_THRESHOLD) {
      return i
    }
  }
  return -1
}

export function calculateLeftScrollTarget(
  sortedTabs: HTMLDivElement[],
  scrollLeft: number
): number {
  const visibleLeft = scrollLeft + CONTAINER_PADDING
  const firstVisibleIndex = findFirstVisibleTabIndex(sortedTabs, visibleLeft)

  if (firstVisibleIndex > 0) {
    const prevTab = sortedTabs[firstVisibleIndex - 1]
    return Math.max(0, prevTab.offsetLeft - CONTAINER_PADDING)
  }
  return 0
}

export function calculateRightScrollTarget(
  sortedTabs: HTMLDivElement[],
  scrollLeft: number,
  containerWidth: number
): number {
  const visibleRight = scrollLeft + containerWidth - CONTAINER_PADDING

  for (const tab of sortedTabs) {
    const tabLeft = tab.offsetLeft
    const tabRight = tabLeft + tab.offsetWidth

    if (tabRight > visibleRight + SCROLL_THRESHOLD) {
      return tabLeft - CONTAINER_PADDING
    }
  }
  return scrollLeft
}

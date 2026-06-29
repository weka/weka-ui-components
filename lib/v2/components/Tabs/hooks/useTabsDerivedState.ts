import type { TabVariant } from '../tabsConstants'

import { TAB_VARIANTS } from '../tabsConstants'

type StyleVariant = Exclude<TabVariant, typeof TAB_VARIANTS.EDITABLE>

interface UseTabsDerivedStateProps {
  variant: TabVariant
  tabsCount: number
  minTabs: number
  maxTabs?: number
  hasLeftOverflow: boolean
  hasRightOverflow: boolean
  onAddTab?: () => void
  onReorderTabs?: (sourceId: string, targetId: string) => void
  draggingTabId?: string | null
  dragOverTabId?: string | null
  localDraggingId: string | null
  localDragOverId: string | null
}

interface UseTabsDerivedStateResult {
  isEditable: boolean
  canDelete: boolean
  canAddTab: boolean
  isDraggable: boolean
  showLeftArrow: boolean
  showRightArrow: boolean
  showAddButton: boolean
  currentDraggingId: string | null
  currentDragOverId: string | null
  styleVariant: StyleVariant
}

export function useTabsDerivedState({
  variant,
  tabsCount,
  minTabs,
  maxTabs,
  hasLeftOverflow,
  hasRightOverflow,
  onAddTab,
  onReorderTabs,
  draggingTabId,
  dragOverTabId,
  localDraggingId,
  localDragOverId
}: UseTabsDerivedStateProps): UseTabsDerivedStateResult {
  const isEditable = variant === TAB_VARIANTS.EDITABLE
  const canDelete = tabsCount > minTabs
  const canAddTab = maxTabs === undefined || tabsCount < maxTabs
  const isDraggable = isEditable && onReorderTabs !== undefined

  const showLeftArrow = isEditable && hasLeftOverflow
  const showRightArrow = isEditable && hasRightOverflow
  const showAddButton = isEditable && onAddTab !== undefined && canAddTab

  const currentDraggingId =
    draggingTabId !== undefined ? draggingTabId : localDraggingId
  const currentDragOverId =
    dragOverTabId !== undefined ? dragOverTabId : localDragOverId

  const styleVariant = isEditable ? TAB_VARIANTS.PRIMARY : variant

  return {
    isEditable,
    canDelete,
    canAddTab,
    isDraggable,
    showLeftArrow,
    showRightArrow,
    showAddButton,
    currentDraggingId,
    currentDragOverId,
    styleVariant
  }
}

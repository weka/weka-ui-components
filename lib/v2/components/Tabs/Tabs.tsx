import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

import {
  Fragment,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'

import {
  DOM_EVENTS,
  EMPTY_STRING,
  ICON_SIZES,
  KEYBOARD_KEYS
} from '#v2/utils/consts'

import { CheckIcon, CloseIcon } from '../../icons'
import { AddTabButton } from './AddTabButton'
import { useTabsCarousel, useTabsDerivedState } from './hooks'
import { ScrollArrow } from './ScrollArrow'
import { TabEditableActions } from './TabEditableActions'
import { TabIcon } from './TabIcon'
import {
  SCROLL_DIRECTIONS,
  type Tab,
  TAB_VARIANTS,
  type TabVariant
} from './tabsConstants'

import styles from './tabs.module.scss'

const EDGE_THRESHOLD = 10
const DRAG_THRESHOLD = 3
const TAB_DRAGGING_STYLE_ID = 'tab-dragging-cursor-style'

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string, subTab?: string) => void
  variant?: TabVariant
  extraClass?: string
  onAddTab?: () => void
  onDeleteTab?: (tabId: string) => void
  onRenameTab?: (tabId: string, newName: string) => void
  onReorderTabs?: (sourceId: string, targetId: string) => void
  onRestoreTab?: (tabId: string) => void
  minTabs?: number
  maxTabs?: number
  draggingTabId?: string | null
  dragOverTabId?: string | null
  newTabId?: string | null
  onEditCancelled?: (tabId: string) => void
}

function createDragPreview(
  tabElement: HTMLDivElement,
  e: globalThis.MouseEvent
): HTMLDivElement {
  const clone = tabElement.cloneNode(true) as HTMLDivElement
  const computedStyle = window.getComputedStyle(tabElement)

  clone.style.position = 'fixed'
  clone.style.pointerEvents = 'none'
  clone.style.zIndex = '10000'
  clone.style.opacity = '0.85'
  clone.style.width = `${tabElement.offsetWidth}px`
  clone.style.height = `${tabElement.offsetHeight}px`
  clone.style.left = `${e.clientX - tabElement.offsetWidth / 2}px`
  clone.style.top = `${e.clientY - tabElement.offsetHeight / 2}px`
  clone.style.backgroundColor = computedStyle.backgroundColor
  clone.style.color = computedStyle.color
  clone.style.borderRadius = computedStyle.borderRadius
  clone.style.padding = computedStyle.padding
  clone.style.fontSize = computedStyle.fontSize
  clone.style.fontWeight = computedStyle.fontWeight
  clone.style.fontFamily = computedStyle.fontFamily
  clone.style.display = computedStyle.display
  clone.style.flexDirection = computedStyle.flexDirection
  clone.style.alignItems = computedStyle.alignItems
  clone.style.justifyContent = computedStyle.justifyContent
  clone.style.gap = computedStyle.gap
  clone.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'
  clone.style.margin = '0'

  return clone
}

function injectDragCursorStyle(): void {
  let styleElement = document.getElementById(
    TAB_DRAGGING_STYLE_ID
  ) as HTMLStyleElement | null
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = TAB_DRAGGING_STYLE_ID
    document.head.appendChild(styleElement)
  }
  styleElement.textContent = `
    *, *:hover, *:active, *:focus {
      cursor: grabbing !important;
      cursor: -webkit-grabbing !important;
      cursor: -moz-grabbing !important;
    }
  `
}

function removeDragCursorStyle(): void {
  const styleElement = document.getElementById(TAB_DRAGGING_STYLE_ID)
  if (styleElement) {
    styleElement.remove()
  }
}

function findTabIdUnderPoint(x: number, y: number): string | null {
  const elementUnder = document.elementFromPoint(x, y)
  const tabElement = elementUnder?.closest('[data-tab-id]')
  return tabElement?.getAttribute('data-tab-id') ?? null
}

function hasMovedPastThreshold(
  current: { x: number; y: number },
  start: { x: number; y: number }
): boolean {
  const deltaX = Math.abs(current.x - start.x)
  const deltaY = Math.abs(current.y - start.y)
  return deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = TAB_VARIANTS.PRIMARY,
  extraClass = EMPTY_STRING,
  onAddTab,
  onDeleteTab,
  onRenameTab,
  onReorderTabs,
  onRestoreTab,
  minTabs = 1,
  maxTabs,
  draggingTabId,
  dragOverTabId,
  newTabId,
  onEditCancelled
}: Readonly<TabsProps>) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingTabName, setEditingTabName] = useState<string>(EMPTY_STRING)
  const [isNewTab, setIsNewTab] = useState(false)
  const [localDraggingId, setLocalDraggingId] = useState<string | null>(null)
  const [localDragOverId, setLocalDragOverId] = useState<string | null>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [nearEdgeTabId, setNearEdgeTabId] = useState<string | null>(null)
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null)
  const hasDraggedRef = useRef(false)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const activeTabIdRef = useRef<string | null>(null)

  const isEditable = variant === TAB_VARIANTS.EDITABLE

  const {
    tabsContainerRef,
    tabRefs,
    showLeftArrow: hasLeftOverflow,
    showRightArrow: hasRightOverflow,
    scrollTabs,
    scrollToTab
  } = useTabsCarousel({
    isEnabled: isEditable,
    tabsCount: tabs.length
  })

  const {
    canDelete,
    isDraggable,
    showLeftArrow,
    showRightArrow,
    showAddButton,
    currentDraggingId,
    currentDragOverId,
    styleVariant
  } = useTabsDerivedState({
    tabsCount: tabs.length,
    draggingTabId,
    dragOverTabId,
    hasLeftOverflow,
    hasRightOverflow,
    localDraggingId,
    localDragOverId,
    maxTabs,
    minTabs,
    onAddTab,
    onReorderTabs,
    variant
  })

  useEffect(() => {
    scrollToTab(activeTab)
  }, [activeTab, scrollToTab])

  const [lastNewTabId, setLastNewTabId] = useState(newTabId)
  const [pendingNewTabId, setPendingNewTabId] = useState<string | null>(null)

  if (newTabId !== lastNewTabId) {
    setLastNewTabId(newTabId)
    if (newTabId) {
      setPendingNewTabId(newTabId)
    }
  }

  if (pendingNewTabId) {
    const tab = tabs.find((t) => t.id === pendingNewTabId)
    if (tab) {
      setPendingNewTabId(null)
      setEditingTabId(tab.id)
      setEditingTabName(tab.label)
      setIsNewTab(true)
    }
  }

  const handleStartEdit = useCallback(
    (e: MouseEvent, tabId: string, currentName: string) => {
      e.stopPropagation()
      setEditingTabId(tabId)
      setEditingTabName(currentName)
    },
    []
  )

  const handleCancelEdit = useCallback(() => {
    if (editingTabId && onEditCancelled) {
      onEditCancelled(editingTabId)
    }
    setEditingTabId(null)
    setEditingTabName(EMPTY_STRING)
    setIsNewTab(false)
  }, [editingTabId, onEditCancelled])

  const handleFinishEdit = useCallback(() => {
    if (editingTabId && editingTabName.trim() && onRenameTab) {
      onRenameTab(editingTabId, editingTabName.trim())
    }
    setEditingTabId(null)
    setEditingTabName(EMPTY_STRING)
    setIsNewTab(false)
  }, [editingTabId, editingTabName, onRenameTab])

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === KEYBOARD_KEYS.ENTER) {
        handleFinishEdit()
        return
      }
      if (e.key === KEYBOARD_KEYS.ESCAPE) {
        if (isNewTab) {
          handleFinishEdit()
        } else {
          handleCancelEdit()
        }
      }
    },
    [handleFinishEdit, handleCancelEdit, isNewTab]
  )

  const handleDelete = useCallback(
    (e: MouseEvent, tabId: string) => {
      e.stopPropagation()
      if (onDeleteTab && canDelete) {
        onDeleteTab(tabId)
      }
    },
    [onDeleteTab, canDelete]
  )

  const handleRestore = useCallback(
    (e: MouseEvent, tabId: string) => {
      e.stopPropagation()
      onRestoreTab?.(tabId)
    },
    [onRestoreTab]
  )

  const handleTabMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>, tabId: string) => {
      if (!isDraggable || editingTabId === tabId) {
        return
      }

      const tab = tabs.find((t) => t.id === tabId)
      if (tab?.isLocked) {
        return
      }

      const target = e.currentTarget
      const rect = target.getBoundingClientRect()
      const nearTopEdge = e.clientY - rect.top < EDGE_THRESHOLD

      if (nearTopEdge) {
        setNearEdgeTabId(tabId)
      } else {
        setNearEdgeTabId(null)
      }
    },
    [isDraggable, editingTabId, tabs]
  )

  const handleTabMouseLeave = useCallback(() => {
    setNearEdgeTabId(null)
  }, [])

  const handleTabMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>, tabId: string) => {
      if (!isDraggable || editingTabId === tabId) {
        return
      }

      const tab = tabs.find((t) => t.id === tabId)
      if (tab?.isLocked) {
        return
      }

      const target = e.currentTarget
      const rect = target.getBoundingClientRect()
      const nearTopEdge = e.clientY - rect.top < EDGE_THRESHOLD

      if (!nearTopEdge) {
        return
      }

      document.body.style.cursor = 'grab'
      document.documentElement.style.cursor = 'grab'

      dragStartPosRef.current = { x: e.clientX, y: e.clientY }
      hasDraggedRef.current = false
      activeTabIdRef.current = tabId
      setIsMouseDown(true)
    },
    [isDraggable, editingTabId, tabs]
  )

  const initiateDrag = useCallback(
    (e: globalThis.MouseEvent, tabId: string) => {
      hasDraggedRef.current = true
      if (draggingTabId === undefined) {
        setLocalDraggingId(tabId)
      }
      injectDragCursorStyle()

      const tabElement = tabRefs.current.get(tabId)
      if (tabElement && !previewRef.current) {
        const clone = createDragPreview(tabElement, e)
        document.body.appendChild(clone)
        previewRef.current = clone
      }
      e.preventDefault()
      e.stopPropagation()
    },
    [draggingTabId, tabRefs]
  )

  const updatePreviewPosition = useCallback(
    (e: globalThis.MouseEvent, tabId: string) => {
      if (!previewRef.current) {
        return
      }
      const tabElement = tabRefs.current.get(tabId)
      if (!tabElement) {
        return
      }
      previewRef.current.style.left = `${
        e.clientX - tabElement.offsetWidth / 2
      }px`
      previewRef.current.style.top = `${
        e.clientY - tabElement.offsetHeight / 2
      }px`
    },
    [tabRefs]
  )

  const updateDragOverTarget = useCallback(
    (e: globalThis.MouseEvent, draggingTab: string) => {
      if (dragOverTabId !== undefined) {
        return
      }
      const targetTabId = findTabIdUnderPoint(e.clientX, e.clientY)
      const targetTab = tabs.find((t) => t.id === targetTabId)
      const isValidTarget =
        targetTabId && targetTabId !== draggingTab && !targetTab?.isLocked
      setLocalDragOverId(isValidTarget ? targetTabId : null)
    },
    [dragOverTabId, tabs]
  )

  const handleGlobalMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDraggable || !dragStartPosRef.current || !activeTabIdRef.current) {
        return
      }

      const currentTabId = activeTabIdRef.current
      const startPos = dragStartPosRef.current
      const shouldStartDrag =
        hasMovedPastThreshold({ x: e.clientX, y: e.clientY }, startPos) &&
        !hasDraggedRef.current

      if (shouldStartDrag) {
        initiateDrag(e, currentTabId)
      }

      if (!hasDraggedRef.current) {
        return
      }

      updatePreviewPosition(e, currentTabId)
      updateDragOverTarget(e, currentTabId)
    },
    [isDraggable, initiateDrag, updatePreviewPosition, updateDragOverTarget]
  )

  const cleanupDragState = useCallback(() => {
    if (previewRef.current) {
      previewRef.current.remove()
      previewRef.current = null
    }
    document.body.style.cursor = EMPTY_STRING
    document.documentElement.style.cursor = EMPTY_STRING
    removeDragCursorStyle()
    dragStartPosRef.current = null
    hasDraggedRef.current = false
    activeTabIdRef.current = null
    setIsMouseDown(false)
    if (draggingTabId === undefined) {
      setLocalDraggingId(null)
    }
    if (dragOverTabId === undefined) {
      setLocalDragOverId(null)
    }
  }, [draggingTabId, dragOverTabId])

  const handleGlobalMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDraggable || !dragStartPosRef.current) {
        return
      }

      const shouldReorder = hasDraggedRef.current && activeTabIdRef.current
      if (shouldReorder) {
        const targetTabId = findTabIdUnderPoint(e.clientX, e.clientY)
        const draggingTab = activeTabIdRef.current
        const targetTab = tabs.find((t) => t.id === targetTabId)
        const isValidDrop =
          targetTabId && targetTabId !== draggingTab && !targetTab?.isLocked
        if (isValidDrop && draggingTab) {
          onReorderTabs?.(draggingTab, targetTabId)
        }
      }

      cleanupDragState()
    },
    [isDraggable, onReorderTabs, cleanupDragState, tabs]
  )

  useEffect(() => {
    if (!isMouseDown) {
      return
    }
    window.addEventListener(DOM_EVENTS.MOUSEMOVE, handleGlobalMouseMove)
    window.addEventListener(DOM_EVENTS.MOUSEUP, handleGlobalMouseUp)

    return () => {
      window.removeEventListener(DOM_EVENTS.MOUSEMOVE, handleGlobalMouseMove)
      window.removeEventListener(DOM_EVENTS.MOUSEUP, handleGlobalMouseUp)
    }
  }, [isMouseDown, handleGlobalMouseMove, handleGlobalMouseUp])

  const renderTabContent = (tab: Tab, isActive: boolean) => {
    if (editingTabId === tab.id) {
      return (
        <div
          className={clsx(styles.tabEditContainer, {
            [styles.newTabEdit]: isNewTab
          })}
        >
          <input
            autoFocus
            className={styles.tabInput}
            data-testid={`tab-${tab.id}-name-input`}
            onBlur={handleCancelEdit}
            onChange={(e) => setEditingTabName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            type='text'
            value={editingTabName}
          />
          {!isNewTab && (
            <button
              className={styles.tabEditActionBtn}
              title='Cancel'
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                handleCancelEdit()
              }}
            >
              <CloseIcon
                height={ICON_SIZES.SM}
                strokeWidth={2.5}
                width={ICON_SIZES.SM}
              />
            </button>
          )}
          <button
            className={styles.tabEditActionBtn}
            title='Confirm'
            type='button'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleFinishEdit()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <CheckIcon
              height={ICON_SIZES.XS}
              width={ICON_SIZES.XS}
            />
          </button>
        </div>
      )
    }

    const countDisplay =
      variant === TAB_VARIANTS.UNDERLINE ? `(${tab.count})` : tab.count

    return (
      <>
        <TabIcon
          isActive={isActive}
          tab={tab}
        />
        <span className={styles.tabLabel}>{tab.label}</span>
        {tab.count !== undefined && (
          <span className={styles.tabCount}>{countDisplay}</span>
        )}
        {isEditable ? (
          <TabEditableActions
            canDelete={canDelete}
            onDelete={handleDelete}
            onRestore={onRestoreTab ? handleRestore : undefined}
            onStartEdit={handleStartEdit}
            tab={tab}
          />
        ) : null}
      </>
    )
  }

  return (
    <div
      className={clsx(
        styles.tabsContainer,
        styles[styleVariant],
        { [styles.editable]: isEditable },
        extraClass
      )}
    >
      <div
        ref={tabsContainerRef}
        className={styles.tabs}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id
          const prevTab = tabs[index - 1]
          const isPrevActive = prevTab && activeTab === prevTab.id
          const showSeparator =
            isEditable && index > 0 && !isActive && !isPrevActive

          return (
            <Fragment key={tab.id}>
              {showSeparator ? <div className={styles.tabSeparator} /> : null}
              <div
                ref={(el) => {
                  if (el) {
                    tabRefs.current.set(tab.id, el)
                  } else {
                    tabRefs.current.delete(tab.id)
                  }
                }}
                data-active={isActive}
                data-tab-id={tab.id}
                data-testid={`tab-${tab.id}`}
                onMouseLeave={handleTabMouseLeave}
                onMouseMove={(e) => handleTabMouseMove(e, tab.id)}
                className={clsx(styles.tab, {
                  [styles.draggable]:
                    isDraggable && editingTabId !== tab.id && !tab.isLocked,
                  [styles.nearEdge]: nearEdgeTabId === tab.id && !tab.isLocked,
                  [styles.dragging]: currentDraggingId === tab.id,
                  [styles.dragOver]: currentDragOverId === tab.id
                })}
                onClick={() => {
                  if (!hasDraggedRef.current) {
                    onTabChange(tab.id, tab.subTab)
                  } else {
                    hasDraggedRef.current = false
                  }
                }}
                onMouseDown={(e) => {
                  hasDraggedRef.current = false
                  handleTabMouseDown(e, tab.id)
                }}
              >
                {renderTabContent(tab, isActive)}
              </div>
            </Fragment>
          )
        })}
      </div>
      {showAddButton && onAddTab ? <AddTabButton onClick={onAddTab} /> : null}
      {isEditable && (showLeftArrow || showRightArrow) ? (
        <div className={styles.scrollArrows}>
          <ScrollArrow
            direction={SCROLL_DIRECTIONS.LEFT}
            disabled={!showLeftArrow}
            onClick={() => scrollTabs(SCROLL_DIRECTIONS.LEFT)}
          />
          <ScrollArrow
            direction={SCROLL_DIRECTIONS.RIGHT}
            disabled={!showRightArrow}
            onClick={() => scrollTabs(SCROLL_DIRECTIONS.RIGHT)}
          />
        </div>
      ) : null}
    </div>
  )
}

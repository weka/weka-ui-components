import type { CustomFilters } from '../FilterPopover'
import type {
  ActiveFilter,
  FilterConfig,
  FilterMeta,
  FilterValue
} from '../filterUtils'
import type { SortDirection } from '@tanstack/react-table'
import type { MouseEvent } from 'react'

import { useEffect, useRef, useState } from 'react'
import { Popover } from '@mui/material'
import clsx from 'clsx'

import { useWindowResize } from '#v2/hooks'
import { EMPTY_STRING, FILTER_TYPES } from '#v2/utils/consts'

import { FilterIcon, SortIcon, SortUpDownIcon } from '../../../icons'
import { FilterPopover } from '../FilterPopover'
import {
  createFilterConfigByType,
  createTextFilter,
  findColumn,
  isFilterValueEmpty
} from '../filterUtils'

import styles from './tableFilter.module.scss'

const POPOVER_WIDTH = 280
const EDGE_THRESHOLD = 60
const EDGE_THRESHOLD_FALLBACK = 80
const POPOVER_PADDING = 20
const MIN_MARGIN = -360
const MAX_MARGIN = -210
const DEFAULT_RIGHT_MARGIN = -310
const CENTER_POPOVER_MARGIN = '-120px'
const LEFT_POPOVER_MARGIN = '20px'
const POPOVER_TOP_MARGIN = '4px'
const SORT_BLUR_DELAY_MS = 100

function checkIsNearRightEdge(
  buttonRect: DOMRect,
  headerRect: DOMRect | undefined
): boolean {
  if (headerRect) {
    const headerCenter = headerRect.left + headerRect.width / 2
    const popoverRightEdge = headerCenter + POPOVER_WIDTH / 2
    return popoverRightEdge > window.innerWidth - EDGE_THRESHOLD
  }
  return (
    buttonRect.left + POPOVER_WIDTH >
    window.innerWidth - EDGE_THRESHOLD_FALLBACK
  )
}

function calculateDynamicMargin(
  buttonRect: DOMRect,
  headerRect: DOMRect | undefined
): number {
  const isNearRightEdge = checkIsNearRightEdge(buttonRect, headerRect)
  if (!isNearRightEdge) {
    return 0
  }

  const spaceFromButtonToEdge = window.innerWidth - buttonRect.right
  const rawMargin = -(POPOVER_WIDTH - spaceFromButtonToEdge - POPOVER_PADDING)
  return Math.max(Math.min(rawMargin, MAX_MARGIN), MIN_MARGIN)
}

export interface TableFilterProps {
  columnId: string
  columns: unknown[]
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  extraClass?: string
  sortDirection?: false | SortDirection
  canSort?: boolean
  onSortClick?: (event: unknown) => void
  canFilter?: boolean
  customFilters?: CustomFilters
}

export function TableFilter({
  columnId,
  columns,
  activeFilters,
  onFilterChange,
  extraClass = EMPTY_STRING,
  sortDirection = false,
  canSort = false,
  canFilter = false,
  onSortClick,
  customFilters
}: Readonly<TableFilterProps>) {
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(
    null
  )
  const [filterButtonRef, setFilterButtonRef] = useState<HTMLElement | null>(
    null
  )
  const [popoverAnchorOrigin, setPopoverAnchorOrigin] = useState<{
    vertical: 'bottom'
    horizontal: 'left' | 'center' | 'right'
    dynamicMargin?: number
  }>({
    vertical: 'bottom',
    horizontal: 'left'
  })

  const mutationObserverRef = useRef<MutationObserver | null>(null)

  useWindowResize(() => {
    setActiveFilterColumn(null)
    setFilterButtonRef(null)
  }, [])

  useEffect(() => {
    const sidebar =
      document.querySelector('aside') ||
      document.querySelector('[class*="sidebar"]')
    if (sidebar) {
      mutationObserverRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            mutation.target === sidebar
          ) {
            setActiveFilterColumn(null)
            setFilterButtonRef(null)
          }
        })
      })

      mutationObserverRef.current.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class']
      })
    }

    return () => {
      mutationObserverRef.current?.disconnect()
    }
  }, [])

  const getFilterConfig = (targetColumnId: string): FilterConfig | null => {
    const column = findColumn(columns, targetColumnId)
    const filterMeta = (column as { meta?: { filter?: FilterMeta } })?.meta
      ?.filter

    if (!filterMeta) {
      return null
    }
    if (typeof filterMeta === 'string') {
      return createTextFilter(targetColumnId)
    }
    if (typeof filterMeta !== 'object' || !('type' in filterMeta)) {
      return createTextFilter(targetColumnId)
    }

    return createFilterConfigByType(targetColumnId, filterMeta)
  }

  const handleFilterButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    const buttonRef = event.currentTarget
    setFilterButtonRef(buttonRef)
    setActiveFilterColumn(columnId)

    const buttonRect = buttonRef.getBoundingClientRect()
    const headerCell = buttonRef.closest('th')
    const headerRect = headerCell?.getBoundingClientRect()

    const dynamicMargin = calculateDynamicMargin(buttonRect, headerRect)
    const isNearRightEdge = checkIsNearRightEdge(buttonRect, headerRect)

    setPopoverAnchorOrigin({
      vertical: 'bottom',
      horizontal: isNearRightEdge ? 'right' : 'left',
      dynamicMargin
    })
  }

  const handleFilterChange = (
    targetColumnId: string,
    value: FilterValue,
    type: FilterConfig['type']
  ) => {
    const existingFilterIndex = activeFilters.findIndex(
      (filter) => filter.columnId === targetColumnId
    )

    if (isFilterValueEmpty(value)) {
      if (existingFilterIndex !== -1) {
        const newFilters = activeFilters.filter(
          (filter) => filter.columnId !== targetColumnId
        )
        onFilterChange(newFilters)
      }
      if (targetColumnId === activeFilterColumn) {
        setActiveFilterColumn(null)
        setFilterButtonRef(null)
      }
      return
    }

    const columnDef = findColumn(columns, targetColumnId)
    const columnName =
      typeof columnDef?.header === 'string' ? columnDef.header : targetColumnId

    const filterConfig = getFilterConfig(targetColumnId)
    const displayLabel = filterConfig?.title || columnName
    const capitalizedLabel =
      displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)

    const newFilter: ActiveFilter = {
      columnId: targetColumnId,
      type:
        type === FILTER_TYPES.AUTOCOMPLETE ? FILTER_TYPES.MULTISELECT : type,
      value: value!,
      label: capitalizedLabel,
      modeLabels: filterConfig?.modeLabels
    }

    let newFilters: ActiveFilter[]
    if (existingFilterIndex !== -1) {
      newFilters = [...activeFilters]
      newFilters[existingFilterIndex] = newFilter
    } else {
      newFilters = [...activeFilters, newFilter]
    }

    onFilterChange(newFilters)
  }

  const hasFilters = activeFilters.some(
    (filter) => filter.columnId === columnId
  )
  const isActiveFilter = activeFilterColumn === columnId
  const isPopoverOpen = activeFilterColumn !== null && filterButtonRef !== null

  const handleSortClick = (event: MouseEvent) => {
    event.stopPropagation()
    const buttonElement = event.currentTarget as HTMLButtonElement

    if (onSortClick) {
      onSortClick(event)

      setTimeout(() => {
        buttonElement.blur()
      }, SORT_BLUR_DELAY_MS)
    }
  }

  const renderSortIcon = () => {
    if (!canSort) {
      return null
    }

    if (sortDirection) {
      return (
        <button
          className={clsx(styles.sortButton, styles.activeSortButton)}
          data-testid={`column-sort-button-${columnId}`}
          onClick={handleSortClick}
          aria-label={`Sort ${
            sortDirection === 'asc' ? 'descending' : 'ascending'
          }`}
        >
          <SortIcon
            extraClass={
              sortDirection === 'desc' ? styles.sortDesc : styles.sortAsc
            }
          />
        </button>
      )
    }

    return (
      <button
        aria-label='Sort column'
        className={clsx(styles.sortButton, styles.inactiveSortButton)}
        data-testid={`column-sort-button-${columnId}`}
        onClick={handleSortClick}
      >
        <SortUpDownIcon />
      </button>
    )
  }

  const renderFilterIcon = () => {
    if (!canFilter) {
      return null
    }
    return (
      <button
        ref={(el) => setFilterButtonRef(el)}
        aria-label='Filter table'
        data-testid={`column-filter-button-${columnId}`}
        onClick={handleFilterButtonClick}
        className={clsx(styles.filterButton, extraClass, {
          [styles.hasFilter]: hasFilters,
          [styles.active]: isActiveFilter,
          [styles.popoverOpen]: isPopoverOpen,
          [styles.hasActiveSort]: !!sortDirection
        })}
      >
        <FilterIcon />
      </button>
    )
  }

  return (
    <>
      <div className={styles.headerIconsContainer}>
        {renderSortIcon()}
        {renderFilterIcon()}
      </div>
      <Popover
        anchorEl={filterButtonRef}
        anchorOrigin={popoverAnchorOrigin}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        open={isPopoverOpen}
        onClose={(event: object | undefined) => {
          if (event && 'stopPropagation' in event) {
            const eventWithStop = event as { stopPropagation: () => void }
            eventWithStop.stopPropagation()
          }
          setActiveFilterColumn(null)
          setFilterButtonRef(null)
          setPopoverAnchorOrigin((prev) => ({ ...prev, dynamicMargin: 0 }))
        }}
        slotProps={{
          paper: {
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              marginTop: POPOVER_TOP_MARGIN,
              overflow: 'visible',
              ...(popoverAnchorOrigin.horizontal === 'right' && {
                marginLeft: `${
                  popoverAnchorOrigin.dynamicMargin || DEFAULT_RIGHT_MARGIN
                }px`
              }),
              ...(popoverAnchorOrigin.horizontal === 'center' && {
                marginLeft: CENTER_POPOVER_MARGIN
              }),
              ...(popoverAnchorOrigin.horizontal === 'left' && {
                marginLeft: LEFT_POPOVER_MARGIN
              })
            }
          }
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: popoverAnchorOrigin.horizontal
        }}
      >
        {activeFilterColumn
          ? (() => {
              const filterConfig = getFilterConfig(activeFilterColumn)
              if (!filterConfig) {
                return null
              }

              const currentFilter = activeFilters.find(
                (filter) => filter.columnId === activeFilterColumn
              )
              const columnDef = findColumn(columns, activeFilterColumn)
              const columnName =
                typeof columnDef?.header === 'string'
                  ? columnDef.header
                  : activeFilterColumn

              return (
                <div className={styles.filterPopoverContainer}>
                  <FilterPopover
                    anchorElement={filterButtonRef}
                    columnId={activeFilterColumn}
                    columnName={columnName}
                    config={filterConfig}
                    customFilters={customFilters}
                    value={currentFilter?.value || EMPTY_STRING}
                    onClose={() => {
                      setActiveFilterColumn(null)
                      setFilterButtonRef(null)
                    }}
                    onValueChange={(value) =>
                      handleFilterChange(
                        activeFilterColumn,
                        value,
                        filterConfig.type
                      )
                    }
                  />
                </div>
              )
            })()
          : null}
      </Popover>
    </>
  )
}

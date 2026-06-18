import type { CustomFilters } from '../FilterPopover'
import type { ActiveFilter } from '../filterUtils'
import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import clsx from 'clsx'

import {
  EMPTY_ARRAY,
  EMPTY_STRING,
  FILTER_TYPES,
  SEARCH_PLACEHOLDER
} from '#v2/utils/consts'

import { DownloadIcon, ResetIcon, SettingsIcon } from '../../../icons'
import { ExpandableSearch } from '../../ExpandableSearch'
import { FilterChips } from '../FilterChips'
import { FilterOptionRow } from '../FilterOptionRow'
import { getColumnId, getColumnLabel } from '../filterUtils'

import styles from './tableHeader.module.scss'

const SETTINGS_MENU_HEIGHT = 250
const SETTINGS_MENU_MARGIN = 4
const VISIBILITY_STATE_SYNC_DELAY = 50
const MIN_VISIBLE_COLUMNS = 1
const NAME_COLUMN_IDS = ['name', 'filename', 'clusterName']
const MIN_SEARCH_LENGTH = 2
const DOWNLOAD_ICON_SIZE = 28

interface TableCsvColumn {
  header: string
  accessor: (row: unknown) => string | number | null | undefined
}

interface CsvField {
  header: string
  getValue: (row: unknown) => unknown
}

interface TableColumnMeta {
  csvFormatter?: (row: unknown) => string | number | null | undefined
  csvColumns?: TableCsvColumn[]
}

interface TableColumn {
  id?: string
  accessorKey?: string
  accessorFn?: ((row: unknown) => unknown) & { name?: string }
  header?: string | (() => ReactNode)
  enableHiding?: boolean
  meta?: TableColumnMeta
}

export interface TableHeaderProps<TData = unknown> {
  csvFileTitle?: string
  title: string
  customTitle?: ReactNode
  count?: number
  activeFilters?: readonly ActiveFilter[]
  onRemoveFilter?: (columnId: string) => void
  onClearAllFilters?: () => void
  onFilterChange?: (filters: ActiveFilter[]) => void
  actions?: ReactNode
  tableActions?: ReactNode
  showFilterChips?: boolean
  showSearch?: boolean
  table?: Table<TData>
  data?: readonly TData[]
  columns?: readonly TableColumn[]
  onResetColumnSizing?: () => void
  onGlobalSearch?: (searchTerm: string) => void
  customFilters?: CustomFilters
  getCsvData?: () => Promise<readonly TData[]>
  onCsvError?: (message: string) => void
}

function findNameColumn(
  columns: readonly TableColumn[]
): TableColumn | undefined {
  return columns.find((col) => {
    const columnId = getColumnId(col)
    return columnId && NAME_COLUMN_IDS.includes(columnId)
  })
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return EMPTY_STRING
  }
  let stringValue: string
  if (typeof value === 'object') {
    stringValue = JSON.stringify(value)
  } else if (typeof value === 'string') {
    stringValue = value
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    stringValue = value.toString()
  } else {
    stringValue = EMPTY_STRING
  }
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function getCellValue(row: unknown, col: TableColumn): unknown {
  if (col.meta?.csvFormatter) {
    return col.meta.csvFormatter(row)
  }
  if (typeof col.accessorFn === 'function') {
    return col.accessorFn(row)
  }
  const columnId = getColumnId(col)
  return columnId ? (row as Record<string, unknown>)[columnId] : undefined
}

function isCsvDownloadDisabled(
  isDownloading: boolean,
  hasCsvDataSource: boolean,
  data: readonly unknown[]
): boolean {
  const hasLocalData = data.length > 0
  return isDownloading || (!hasCsvDataSource && !hasLocalData)
}

function createMultiselectFilter(
  columnId: string,
  value: string,
  label: string
): ActiveFilter {
  return {
    columnId,
    label,
    type: FILTER_TYPES.MULTISELECT,
    value: [value]
  }
}

interface MenuPositionResult {
  shouldShowAbove: boolean
  fixedPosition: { top: number; right: number } | null
}

function hasContainerOverflowHidden(container: Element): boolean {
  const styles = window.getComputedStyle(container)
  return styles.overflow === 'hidden' || styles.overflowY === 'hidden'
}

function calculateMenuPosition(
  buttonRect: DOMRect,
  container: Element | null
): MenuPositionResult {
  const containerRect = container?.getBoundingClientRect()
  const hasOverflow = container && hasContainerOverflowHidden(container)

  if (hasOverflow && containerRect) {
    const spaceBelow = containerRect.bottom - buttonRect.bottom
    const spaceAbove = buttonRect.top - containerRect.top
    const shouldShowAbove =
      spaceBelow < SETTINGS_MENU_HEIGHT && spaceAbove > spaceBelow

    const rightOffset = window.innerWidth - buttonRect.right
    const topPosition = shouldShowAbove
      ? buttonRect.top - SETTINGS_MENU_HEIGHT - SETTINGS_MENU_MARGIN
      : buttonRect.bottom + SETTINGS_MENU_MARGIN

    return {
      shouldShowAbove,
      fixedPosition: { top: topPosition, right: rightOffset }
    }
  }

  const spaceBelow = window.innerHeight - buttonRect.bottom
  return {
    shouldShowAbove: spaceBelow < SETTINGS_MENU_HEIGHT,
    fixedPosition: null
  }
}

export function TableHeader({
  title,
  customTitle,
  csvFileTitle,
  count,
  activeFilters = EMPTY_ARRAY,
  onRemoveFilter,
  onClearAllFilters,
  onFilterChange,
  actions,
  tableActions,
  showFilterChips = true,
  showSearch = false,
  table,
  data = EMPTY_ARRAY,
  columns = EMPTY_ARRAY,
  onResetColumnSizing,
  onGlobalSearch,
  customFilters,
  getCsvData,
  onCsvError
}: Readonly<TableHeaderProps>) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [menuPositionAbove, setMenuPositionAbove] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    right: number
  } | null>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const [immediateState, setImmediateState] = useState<Record<string, boolean>>(
    {}
  )
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const tableColumnVisibility = table?.getState().columnVisibility || {}
  const columnVisibility = { ...tableColumnVisibility, ...immediateState }

  useEffect(() => {
    const timeoutId = setTimeout(forceUpdate, VISIBILITY_STATE_SYNC_DELAY)
    return () => clearTimeout(timeoutId)
  }, [activeFilters])

  const getDisplayCount = useCallback(() => {
    let displayCount = count
    const hasActiveFilters = activeFilters && activeFilters.length > 0

    if (hasActiveFilters && table?.getFilteredRowModel) {
      try {
        const filteredRows = table.getFilteredRowModel().rows
        displayCount = filteredRows.length
      } catch {
        displayCount = count
      }
    }

    return displayCount
  }, [count, activeFilters, table])

  const renderCount = useCallback(() => {
    const displayCount = getDisplayCount()
    return displayCount !== undefined ? (
      <span className={styles.count}>({displayCount})</span>
    ) : null
  }, [getDisplayCount])

  const handleAddToFilter = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      if (!trimmedValue || trimmedValue.length < MIN_SEARCH_LENGTH) {
        return
      }

      const nameColumn = findNameColumn(columns)
      if (!nameColumn || !onFilterChange) {
        return
      }

      const columnId = getColumnId(nameColumn)
      if (!columnId) {
        return
      }

      const label = getColumnLabel(nameColumn, columnId)
      const newFilter = createMultiselectFilter(columnId, value, label)

      const existingFilterIndex = activeFilters.findIndex(
        (filter) => filter.columnId === columnId
      )

      const newFilters =
        existingFilterIndex !== -1
          ? activeFilters.map((f, i) =>
              i === existingFilterIndex ? newFilter : f
            )
          : [...activeFilters, newFilter]

      onFilterChange(newFilters)
      table?.getColumn(columnId)?.setFilterValue([value])
    },
    [columns, onFilterChange, activeFilters, table]
  )

  const handleSearchClear = useCallback(() => {
    onGlobalSearch?.(EMPTY_STRING)
  }, [onGlobalSearch])

  const handleDownload = async () => {
    let exportData: readonly unknown[] = data
    if (getCsvData) {
      setIsDownloading(true)
      try {
        exportData = await getCsvData()
      } catch {
        onCsvError?.('Failed to export data. Please try again.')
        return
      } finally {
        setIsDownloading(false)
      }
    }

    if (!exportData || exportData.length === 0) {
      return
    }

    const visibleColumns = columns.filter((col) => {
      const columnId = getColumnId(col)
      return columnId && columnVisibility[columnId] !== false
    })

    const csvFields = visibleColumns.flatMap((col): CsvField[] => {
      const csvColumns = col.meta?.csvColumns
      if (csvColumns) {
        return csvColumns.map((csvColumn) => ({
          header: csvColumn.header,
          getValue: csvColumn.accessor
        }))
      }
      const header =
        typeof col.header === 'string'
          ? col.header
          : getColumnId(col) || 'Column'
      return [{ header, getValue: (row: unknown) => getCellValue(row, col) }]
    })

    const headers = csvFields.map((field) => escapeCsvValue(field.header))

    const csvRows = exportData.map((row) =>
      csvFields.map((field) => escapeCsvValue(field.getValue(row))).join(',')
    )

    const csvContent = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileTitle = csvFileTitle || title
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `${fileTitle.toLowerCase().replace(/\s+/g, '_')}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleColumnVisibilityToggle = (columnId: string) => {
    if (table) {
      const currentVisibility = columnVisibility[columnId] !== false
      const newVisibility = !currentVisibility

      setImmediateState((prev) => ({
        ...prev,
        [columnId]: newVisibility
      }))

      const currentTableState = table.getState().columnVisibility
      const newTableState = {
        ...currentTableState,
        [columnId]: newVisibility
      }

      table.setColumnVisibility(newTableState)

      setTimeout(() => {
        setImmediateState((prev) => {
          const newState = { ...prev }
          delete newState[columnId]
          return newState
        })
      }, VISIBILITY_STATE_SYNC_DELAY)
    }
  }

  const toggleSettingsMenu = () => {
    if (!showSettingsMenu && settingsButtonRef.current) {
      const buttonRect = settingsButtonRef.current.getBoundingClientRect()
      const container = settingsButtonRef.current.closest(
        '[class*="subTabContent"], [class*="tableContent"], [class*="tableWrapper"], [class*="container"]'
      )
      const { shouldShowAbove, fixedPosition } = calculateMenuPosition(
        buttonRect,
        container
      )
      setMenuPositionAbove(shouldShowAbove)
      setMenuPosition(fixedPosition)
    }
    setShowSettingsMenu(!showSettingsMenu)
  }

  const canShowFilterChips = Boolean(
    showFilterChips &&
      activeFilters.length > 0 &&
      onClearAllFilters &&
      onRemoveFilter
  )

  const renderFilterChips = () =>
    canShowFilterChips && onClearAllFilters && onRemoveFilter ? (
      <FilterChips
        activeFilters={activeFilters}
        columns={columns}
        customFilters={customFilters}
        onClearAllFilters={onClearAllFilters}
        onRemoveFilter={onRemoveFilter}
      />
    ) : null

  const hasRightSectionContent = Boolean(
    actions || tableActions || data || columns.length > 0
  )

  const showCustomTitleFilters = customTitle ? canShowFilterChips : false
  const showDefaultFilters = !customTitle
  const isDownloadDisabled = isCsvDownloadDisabled(
    isDownloading,
    Boolean(getCsvData),
    data
  )

  const renderTitle = () => {
    if (customTitle) {
      return (
        <div className={styles.customTitleContainer}>
          <div className={styles.customTitle}>{customTitle}</div>
        </div>
      )
    }
    return (
      <>
        <h2
          className={styles.title}
          data-testid='table-header-title'
        >
          {title}
        </h2>
        {renderCount()}
      </>
    )
  }

  const renderSearch = () =>
    showSearch ? (
      <ExpandableSearch
        dataTestId='table-header-search'
        onClear={handleSearchClear}
        onSearch={(value) => onGlobalSearch?.(value)}
        onSubmit={handleAddToFilter}
        placeholder={SEARCH_PLACEHOLDER}
        showSubmitButton
      />
    ) : null

  const renderMenuOverlay = () =>
    showSettingsMenu ? (
      <div
        className={styles.menuOverlay}
        onClick={() => setShowSettingsMenu(false)}
      />
    ) : null

  const renderCustomTitleFilters = () =>
    showCustomTitleFilters ? (
      <div className={styles.customTitleFilters}>{renderFilterChips()}</div>
    ) : null

  const renderDefaultFilters = () =>
    showDefaultFilters ? renderFilterChips() : null

  const renderSettingsMenu = () => {
    if (!showSettingsMenu) {
      return null
    }

    const menuStyle = menuPosition
      ? {
          position: 'fixed' as const,
          top: `${menuPosition.top}px`,
          right: `${menuPosition.right}px`,
          left: 'auto'
        }
      : undefined

    const visibleColumnCount = columns.filter((col) => {
      const columnId = getColumnId(col)
      return columnId !== undefined && columnVisibility[columnId] !== false
    }).length

    return (
      <div
        data-testid='table-settings-menu'
        style={menuStyle}
        className={clsx(
          styles.settingsMenu,
          menuPositionAbove && styles.menuAbove,
          menuPosition && styles.menuFixed
        )}
      >
        <div className={styles.menuSection}>
          {columns.map((col) => {
            const columnId = getColumnId(col)
            if (!columnId) {
              return null
            }
            const header =
              typeof col.header === 'string' ? col.header : columnId
            const isSelected = columnVisibility[columnId] !== false

            const isLastVisibleColumn =
              isSelected && visibleColumnCount <= MIN_VISIBLE_COLUMNS

            return (
              <FilterOptionRow
                key={columnId}
                dataTestId={`table-settings-column-option-${columnId}`}
                disabled={isLastVisibleColumn}
                isSelected={isSelected}
                label={header}
                onChange={() => handleColumnVisibilityToggle(columnId)}
              />
            )
          })}
        </div>
        <div className={styles.divider} />
        <div
          className={styles.resetColumnResizing}
          onClick={onResetColumnSizing}
        >
          <ResetIcon />
          Reset Column Resizing
        </div>
      </div>
    )
  }

  const renderRightSection = () => {
    if (!hasRightSectionContent) {
      return null
    }
    const buttonClass = clsx(
      styles.iconButton,
      showSettingsMenu && styles.active
    )
    return (
      <div className={styles.rightSection}>
        {actions}
        {tableActions}
        <div className={styles.tableActions}>
          <button
            ref={settingsButtonRef}
            className={buttonClass}
            data-testid='table-settings-button'
            onClick={toggleSettingsMenu}
            title='Table Settings'
          >
            <SettingsIcon variant='outline' />
          </button>
          <button
            className={styles.iconButton}
            data-testid='table-download-button'
            disabled={isDownloadDisabled}
            onClick={() => void handleDownload()}
            title='Download CSV'
          >
            <DownloadIcon
              height={DOWNLOAD_ICON_SIZE}
              width={DOWNLOAD_ICON_SIZE}
            />
          </button>
          {renderSettingsMenu()}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tableHeader}>
      <div className={styles.leftSection}>
        {renderTitle()}
        {renderSearch()}
        {renderCustomTitleFilters()}
        {renderDefaultFilters()}
      </div>
      {renderRightSection()}
      {renderMenuOverlay()}
    </div>
  )
}

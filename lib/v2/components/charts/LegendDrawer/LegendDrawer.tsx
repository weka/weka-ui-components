import { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'

import { EMPTY_SET, EMPTY_STRING } from '#v2/utils/consts'

import { Checkbox } from '../../CheckBox'
import { type SeriesConfig } from '../chartTypes'
import { LegendItem } from './LegendItem'
import { SortableHeaderCell } from './SortableHeaderCell'
import { useDrawerResize } from './useDrawerResize'

import styles from './legendDrawer.module.scss'

type ColumnCount = 1 | 2 | 3

export interface LegendDrawerProps {
  series: SeriesConfig[]
  hiddenMetrics?: Set<string>
  onShowAll?: () => void
  onHideAll?: () => void
  toggleMetric?: (key: string) => void
  multiselect?: boolean
  showCheckboxes?: boolean
  columns?: ColumnCount
  includeTotal?: boolean
  totalItem?: SeriesConfig
  defaultOpen?: boolean
  defaultWidth?: number
  onVisibilityChange?: (isOpen: boolean) => void
  onWidthChange?: (width: number) => void
  showValues?: boolean
  nameHeaderLabel?: string
  valueHeaderLabel?: string
  preserveOrder?: boolean
  nameColumnRatio?: number
}

const SORT_BY = {
  NAME: 'name',
  VALUE: 'value'
} as const

type SortBy = (typeof SORT_BY)[keyof typeof SORT_BY]

function getDrawerStyles(isOpen: boolean, width: number) {
  return {
    width: isOpen ? `${width}px` : 0,
    flexBasis: isOpen ? `${width}px` : 0,
    ['--drawer-width' as string]: `${width}px`
  }
}

function isPartiallyChecked(hiddenCount: number, totalCount: number): boolean {
  return hiddenCount > 0 && hiddenCount < totalCount
}

function compareLegendValues(itemA: SeriesConfig, itemB: SeriesConfig): number {
  if (typeof itemA.value === 'number' && typeof itemB.value === 'number') {
    return itemA.value - itemB.value
  }

  const valueA = itemA.formattedValue ?? String(itemA.value ?? EMPTY_STRING)
  const valueB = itemB.formattedValue ?? String(itemB.value ?? EMPTY_STRING)

  return valueA.localeCompare(valueB, undefined, {
    numeric: true,
    sensitivity: 'base'
  })
}

function compareSeriesItems(
  itemA: SeriesConfig,
  itemB: SeriesConfig,
  sortBy: SortBy,
  sortAscending: boolean
): number {
  if (sortBy === SORT_BY.NAME) {
    const nameA = itemA.name.toLowerCase()
    const nameB = itemB.name.toLowerCase()
    return sortAscending
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA)
  }
  const comparison = compareLegendValues(itemA, itemB)
  return sortAscending ? comparison : -comparison
}

export function LegendDrawer({
  series,
  hiddenMetrics = EMPTY_SET,
  onShowAll,
  onHideAll,
  toggleMetric,
  multiselect = true,
  showCheckboxes = true,
  columns = 1,
  includeTotal = false,
  totalItem,
  defaultOpen = true,
  defaultWidth: customDefaultWidth,
  onVisibilityChange,
  onWidthChange,
  showValues = false,
  nameHeaderLabel = 'Name',
  valueHeaderLabel = 'Value',
  preserveOrder = false,
  nameColumnRatio
}: Readonly<LegendDrawerProps>) {
  const { drawerRef, isOpen, isDragging, displayWidth, handleMouseDown } =
    useDrawerResize({
      defaultOpen,
      customDefaultWidth,
      showValues,
      onVisibilityChange,
      onWidthChange
    })

  const [sortAscending, setSortAscending] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>(SORT_BY.NAME)
  const hasNumericValues = useMemo(
    () => series.some((item) => typeof item.value === 'number'),
    [series]
  )

  const handleSortByName = useCallback(() => {
    if (sortBy === SORT_BY.NAME) {
      setSortAscending((prev) => !prev)
    } else {
      setSortBy(SORT_BY.NAME)
      setSortAscending(true)
    }
  }, [sortBy])

  const handleSortByValue = useCallback(() => {
    if (sortBy === SORT_BY.VALUE) {
      setSortAscending((prev) => !prev)
    } else {
      setSortBy(SORT_BY.VALUE)
      setSortAscending(!hasNumericValues)
    }
  }, [sortBy, hasNumericValues])

  const canToggle = showCheckboxes && multiselect

  const sortedSeries = useMemo(() => {
    const regularItems = series.filter(
      (seriesItem) => seriesItem.key !== totalItem?.key
    )
    if (!preserveOrder) {
      regularItems.sort((itemA, itemB) =>
        compareSeriesItems(itemA, itemB, sortBy, sortAscending)
      )
    }
    return regularItems
  }, [series, sortAscending, sortBy, totalItem, preserveOrder])

  const handleSelectAllChange = () => {
    const shouldShowAll = hiddenMetrics.size > 0
    if (shouldShowAll) {
      onShowAll?.()
    } else {
      onHideAll?.()
    }
  }

  const renderLegendItem = (
    item: SeriesConfig,
    index: number,
    isTotal = false
  ) => (
    <LegendItem
      key={`${item.key}-${index}`}
      clickable={canToggle}
      isHidden={hiddenMetrics.has(item.key)}
      isTotal={isTotal}
      item={item}
      showCheckboxes={showCheckboxes}
      showValues={showValues}
      onToggle={() => {
        if (canToggle) {
          toggleMetric?.(item.key)
        }
      }}
    />
  )

  const columnClass = `columns${columns}` as keyof typeof styles

  return (
    <div
      ref={drawerRef}
      className={clsx(styles.legendDrawer, {
        [styles.open]: isOpen,
        [styles.dragging]: isDragging
      })}
      style={{
        ...getDrawerStyles(isOpen, displayWidth),
        ...(nameColumnRatio !== undefined && {
          ['--name-column-ratio' as string]: nameColumnRatio
        })
      }}
    >
      <div
        className={styles.resizeHandle}
        onMouseDown={handleMouseDown}
      />
      <div className={styles.drawerContent}>
        <div className={styles.legendHeader}>
          {canToggle ? (
            <div
              className={clsx(styles.selectAllItem, {
                [styles.withValue]: showValues
              })}
            >
              <div className={styles.selectAllLeft}>
                <Checkbox
                  checked={hiddenMetrics.size === 0}
                  onChange={handleSelectAllChange}
                  partiallyChecked={isPartiallyChecked(
                    hiddenMetrics.size,
                    series.length
                  )}
                />
                <SortableHeaderCell
                  headerClass={styles.nameHeader}
                  isActive={sortBy === SORT_BY.NAME}
                  label={nameHeaderLabel}
                  labelClass={styles.nameLabel}
                  notSortable={preserveOrder}
                  onSort={handleSortByName}
                  sortAscending={sortAscending}
                />
              </div>
              {showValues ? (
                <SortableHeaderCell
                  headerClass={styles.valueHeader}
                  isActive={sortBy === SORT_BY.VALUE}
                  label={valueHeaderLabel}
                  notSortable={preserveOrder}
                  onSort={handleSortByValue}
                  sortAscending={sortAscending}
                />
              ) : null}
            </div>
          ) : null}
          {!showCheckboxes && (
            <div
              className={clsx(styles.headerRow, styles.withoutCheckbox, {
                [styles.withValue]: showValues
              })}
            >
              <div className={styles.headerLeft}>
                <SortableHeaderCell
                  headerClass={styles.nameHeader}
                  isActive={sortBy === SORT_BY.NAME}
                  label={nameHeaderLabel}
                  labelClass={styles.nameLabel}
                  notSortable={preserveOrder}
                  onSort={handleSortByName}
                  sortAscending={sortAscending}
                />
              </div>
              {showValues ? (
                <SortableHeaderCell
                  headerClass={styles.valueHeader}
                  isActive={sortBy === SORT_BY.VALUE}
                  label={valueHeaderLabel}
                  notSortable={preserveOrder}
                  onSort={handleSortByValue}
                  sortAscending={sortAscending}
                />
              ) : null}
            </div>
          )}
        </div>
        <div className={styles.legendContainer}>
          <div className={clsx(styles.legendGrid, styles[columnClass])}>
            {sortedSeries.map((item, index) =>
              renderLegendItem(item, index, false)
            )}
          </div>
          {includeTotal && totalItem ? (
            <div className={styles.totalItemWrapper}>
              {renderLegendItem(totalItem, -1, true)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

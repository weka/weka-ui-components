import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import SimpleBar from 'simplebar-react'

import { EMPTY_STRING } from '../../utils/consts'
import { Tooltip } from '../Tooltip'

import 'simplebar-react/dist/simplebar.min.css'
import styles from './simpleTable.module.scss'

export interface SimpleTableColumn<T> {
  key: string
  header?: string
  width?: string | number
  className?: string
  render: (row: T) => ReactNode
  tooltip?: (row: T) => string
}

export interface SimpleTableTab {
  id: string
  label: string
}

export interface SimpleTableProps<T> {
  data: T[]
  columns: SimpleTableColumn<T>[]
  rowKey?: (row: T, index: number) => string | number
  rowClassName?: string
  extraClass?: string
  emptyMessage?: string
  maxHeight?: string | number
  tabs?: SimpleTableTab[]
  activeTab?: string
  onTabChange?: (id: string) => void
  onRowClick?: (row: T) => void
}

const DEFAULT_EMPTY_MESSAGE = 'No data'

/**
 * Translate a column width into a CSS `flex` value.
 * - undefined → `flex: 1` (column grows to fill)
 * - number → fixed `flex: 0 0 ${width}px` (px appended for valid CSS)
 * - string → fixed `flex: 0 0 ${width}` (assumed to include a unit)
 */
function flexFromWidth(width: string | number | undefined): CSSProperties {
  if (width === undefined) {
    return { flex: 1 }
  }
  const basis = typeof width === 'number' ? `${width}px` : width
  return { flex: `0 0 ${basis}` }
}

interface WithId {
  id: string | number
}

function hasId(row: unknown): row is WithId {
  return (
    typeof row === 'object' &&
    row !== null &&
    'id' in row &&
    (typeof (row as WithId).id === 'string' ||
      typeof (row as WithId).id === 'number')
  )
}

function getRowKey<T>(
  row: T,
  index: number,
  rowKey?: (row: T, index: number) => string | number
): string | number {
  if (rowKey) {
    return rowKey(row, index)
  }
  if (hasId(row)) {
    return row.id
  }
  return index
}

export function SimpleTable<T>({
  data,
  columns,
  rowKey,
  rowClassName = EMPTY_STRING,
  extraClass = EMPTY_STRING,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  maxHeight,
  tabs,
  activeTab,
  onTabChange,
  onRowClick
}: Readonly<SimpleTableProps<T>>) {
  const hasHeader = columns.some((col) => col.header)

  return (
    <div
      className={clsx(styles.tableContainer, extraClass)}
      style={{ maxHeight }}
    >
      {tabs && tabs.length > 0 ? (
        <div className={styles.tabBar}>
          {tabs.map((tab) => (
            <span
              key={tab.id}
              data-testid={`table-tab-${tab.id}`}
              onClick={() => onTabChange?.(tab.id)}
              className={clsx(
                activeTab !== tab.id && styles.tab,
                activeTab === tab.id && styles.tabActive
              )}
            >
              {tab.label}
            </span>
          ))}
        </div>
      ) : null}
      {hasHeader ? (
        <div className={styles.headerRow}>
          {columns.map((col, colIndex) => (
            <div
              key={col.key || colIndex}
              className={styles.headerCell}
              style={flexFromWidth(col.width)}
            >
              {col.header ?? EMPTY_STRING}
            </div>
          ))}
        </div>
      ) : null}
      {data.length === 0 ? (
        <div className={styles.empty}>{emptyMessage}</div>
      ) : (
        <SimpleBar className={styles.list}>
          {data.map((row, index) => {
            const key = getRowKey(row, index, rowKey)
            return (
              <div
                key={key}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  styles.row,
                  rowClassName,
                  onRowClick && styles.clickableRow
                )}
              >
                {columns.map((col, colIndex) => (
                  <div
                    key={col.key || colIndex}
                    className={clsx(styles.cell, col.className)}
                    style={flexFromWidth(col.width)}
                  >
                    {col.tooltip ? (
                      <Tooltip
                        data={col.tooltip(row)}
                        ellipsis
                        ellipsisClass={styles.tooltipCell}
                      >
                        <span>{col.render(row)}</span>
                      </Tooltip>
                    ) : (
                      col.render(row)
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </SimpleBar>
      )}
    </div>
  )
}

import type { ColumnWithHeader } from '../filterUtils'
import type { TableHeaderLabels } from './TableHeader'
import type { VisibilityState } from '@tanstack/react-table'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FilterOptionRow } from '../FilterOptionRow'
import { getColumnId } from '../filterUtils'

import styles from './tableHeader.module.scss'

const MIN_VISIBLE_COLUMNS = 1
const DEFAULT_COLUMNS_TESTID = 'table-settings-default-columns'
const MORE_COLUMNS_TESTID = 'table-settings-more-columns'

interface TableSettingsColumnsProps {
  columns: readonly ColumnWithHeader[]
  columnVisibility: VisibilityState
  /** When set, columns split into default-visible and extra sections. */
  defaultColumnVisibility?: VisibilityState
  labels: TableHeaderLabels
  onToggle: (columnId: string) => void
}

export function TableSettingsColumns({
  columns,
  columnVisibility,
  defaultColumnVisibility,
  labels,
  onToggle
}: Readonly<TableSettingsColumnsProps>) {
  const identifiedColumns = columns.filter((col) => getColumnId(col))
  const visibleColumnCount = identifiedColumns.filter(
    (col) => columnVisibility[getColumnId(col) ?? EMPTY_STRING] !== false
  ).length

  const renderColumnRow = (col: ColumnWithHeader) => {
    const columnId = getColumnId(col)
    if (!columnId) {
      return null
    }
    const header = typeof col.header === 'string' ? col.header : columnId
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
        onChange={() => onToggle(columnId)}
      />
    )
  }

  if (!defaultColumnVisibility) {
    return <>{columns.map(renderColumnRow)}</>
  }

  const isDefaultColumn = (col: ColumnWithHeader) =>
    defaultColumnVisibility[getColumnId(col) ?? EMPTY_STRING] !== false
  const defaultColumns = identifiedColumns.filter(isDefaultColumn)
  const moreColumns = identifiedColumns.filter((col) => !isDefaultColumn(col))

  const renderGroup = (
    testId: string,
    title: string,
    groupColumns: ColumnWithHeader[]
  ) =>
    groupColumns.length > 0 ? (
      <div
        className={styles.menuGroup}
        data-testid={testId}
      >
        <div className={styles.menuGroupTitle}>{title}</div>
        {groupColumns.map(renderColumnRow)}
      </div>
    ) : null

  return (
    <>
      {renderGroup(
        DEFAULT_COLUMNS_TESTID,
        labels.defaultColumns,
        defaultColumns
      )}
      {renderGroup(MORE_COLUMNS_TESTID, labels.moreColumns, moreColumns)}
    </>
  )
}

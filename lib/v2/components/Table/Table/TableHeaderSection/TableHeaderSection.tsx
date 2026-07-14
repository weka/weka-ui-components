import type { CustomFilters } from '../../FilterPopover'
import type { ActiveFilter } from '../../filterUtils'
import type { TableHeaderProps } from '../../TableHeader'
import type { ColumnDef, Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FilterChips } from '../../FilterChips'
import { TableHeader } from '../../TableHeader'

import styles from '../table.module.scss'

export interface TableHeaderSectionProps<TData> {
  useTableHeader: boolean
  title?: string
  customTitle?: ReactNode
  actualFilteredCount: number
  activeFilters: ActiveFilter[]
  showFilterChips: boolean
  showSearch: boolean
  tableHeaderActions?: ReactNode
  data: TData[]
  table: Table<TData>
  columns: ColumnDef<TData>[]
  csvFileTitle?: string
  tableActions?: ReactNode
  customFilters?: CustomFilters
  getCsvData?: () => Promise<readonly TData[]>
  onCsvError?: (message: string) => void
  showCsvDownload?: boolean
  onClearAllFilters: () => void
  onFilterChange: (filters: ActiveFilter[]) => void
  onGlobalSearch: (searchTerm: string) => void
  onRemoveFilter: (columnId: string) => void
  onResetColumnSizing: () => void
  endless?: boolean
}

function renderTitleSection(
  title: string | undefined,
  customTitle: ReactNode,
  actualFilteredCount: number,
  endless: boolean
): ReactNode {
  if (customTitle) {
    return <div className={styles.customTitle}>{customTitle}</div>
  }
  return (
    <>
      <h3 className={styles.tableTitle}>{title}</h3>
      {!endless && actualFilteredCount > 0 ? (
        <span className={styles.tableCount}>({actualFilteredCount})</span>
      ) : null}
    </>
  )
}

export function TableHeaderSection<TData>({
  useTableHeader,
  title,
  customTitle,
  actualFilteredCount,
  activeFilters,
  showFilterChips,
  showSearch,
  tableHeaderActions,
  data,
  table,
  columns,
  csvFileTitle,
  tableActions,
  customFilters,
  getCsvData,
  onCsvError,
  showCsvDownload,
  onClearAllFilters,
  onFilterChange,
  onGlobalSearch,
  onRemoveFilter,
  onResetColumnSizing,
  endless = false
}: Readonly<TableHeaderSectionProps<TData>>) {
  const hasTitle = Boolean(title || customTitle)
  const hasActiveFilters = activeFilters.length > 0

  if (useTableHeader) {
    return (
      <TableHeader
        actions={tableHeaderActions}
        activeFilters={activeFilters}
        columns={columns as unknown as TableHeaderProps['columns']}
        count={actualFilteredCount}
        csvFileTitle={csvFileTitle}
        customFilters={customFilters}
        customTitle={customTitle}
        data={data}
        endless={endless}
        getCsvData={getCsvData}
        onClearAllFilters={onClearAllFilters}
        onCsvError={onCsvError}
        onFilterChange={onFilterChange}
        onGlobalSearch={onGlobalSearch}
        onRemoveFilter={onRemoveFilter}
        onResetColumnSizing={onResetColumnSizing}
        showCsvDownload={showCsvDownload}
        showFilterChips={showFilterChips}
        showSearch={showSearch}
        table={table as unknown as Table<unknown>}
        tableActions={tableActions}
        title={customTitle ? EMPTY_STRING : title || EMPTY_STRING}
      />
    )
  }

  if (!hasTitle) {
    return null
  }

  return (
    <div className={styles.tableHeader}>
      <div className={styles.titleRow}>
        <div className={styles.titleSection}>
          {renderTitleSection(title, customTitle, actualFilteredCount, endless)}
        </div>
        {showFilterChips && hasActiveFilters ? (
          <FilterChips
            activeFilters={activeFilters}
            columns={columns}
            customFilters={customFilters}
            onClearAllFilters={onClearAllFilters}
            onRemoveFilter={onRemoveFilter}
          />
        ) : null}
      </div>
    </div>
  )
}

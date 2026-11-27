import type { CustomFilters } from '../FilterPopover'
import type { ActiveFilter } from '../filterUtils'
import type {
  ColumnDef,
  Header,
  Table as TanstackTable
} from '@tanstack/react-table'
import type { MouseEvent } from 'react'

import clsx from 'clsx'

import { TableFilter } from '../TableFilter'
import { getCanShowFilter } from '../tableUtils'
import { HeaderLabel } from './HeaderLabel'
import { COLUMN_ID_ATTR } from './hooks/useColumnReorder'
import { ROW_ACTIONS_COLUMN_ID } from './tableConsts'

import styles from './table.module.scss'

interface TableHeadRowProps<TData> {
  readonly table: TanstackTable<TData>
  readonly columns: ColumnDef<TData>[]
  readonly activeFilters: ActiveFilter[]
  readonly customFilters?: CustomFilters
  readonly onFilterChange: (filters: ActiveFilter[]) => void
  readonly hasResizableColumns: boolean
  readonly firstDataColumnId?: string
  readonly isColumnMovable?: (columnId: string) => boolean
  readonly onColumnDragStart?: (
    columnId: string,
    event: MouseEvent<HTMLElement>
  ) => void
}

/** Renders the sticky `<thead>`: header labels, sort/filter controls, resizers. */
export function TableHeadRow<TData>({
  table,
  columns,
  activeFilters,
  customFilters,
  onFilterChange,
  hasResizableColumns,
  firstDataColumnId,
  isColumnMovable,
  onColumnDragStart
}: Readonly<TableHeadRowProps<TData>>) {
  const renderHeaderCell = (header: Header<TData, unknown>) => {
    const columnId = header.column.id || header.id
    const canFilter = getCanShowFilter(header)
    const canSort = header.column.getCanSort()
    const isMovable = isColumnMovable?.(header.column.id) ?? false

    return (
      <th
        key={header.id}
        {...{ [COLUMN_ID_ATTR]: header.column.id }}
        data-testid={`column-header-${columnId}`}
        style={{ width: header.getSize() }}
        className={clsx(styles.headerCell, {
          [styles.stickyActions]: header.column.id === ROW_ACTIONS_COLUMN_ID,
          [styles.stickyFirst]: header.column.id === firstDataColumnId,
          [styles.movableHeader]: isMovable
        })}
        onMouseDown={
          isMovable
            ? (event) => onColumnDragStart?.(header.column.id, event)
            : undefined
        }
      >
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <HeaderLabel
              canSort={canSort}
              header={header}
            />
            <div className={styles.headerIcons}>
              {canFilter || canSort ? (
                <TableFilter
                  activeFilters={activeFilters}
                  canFilter={canFilter}
                  canSort={canSort}
                  columnId={header.column.id}
                  columns={columns}
                  customFilters={customFilters}
                  onFilterChange={onFilterChange}
                  onSortClick={header.column.getToggleSortingHandler()}
                  sortDirection={header.column.getIsSorted()}
                />
              ) : null}
            </div>
          </div>
        </div>
        {hasResizableColumns && header.column.getCanResize() ? (
          <div
            className={styles.resizer}
            data-testid={`column-resizer-${columnId}`}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
          />
        ) : null}
      </th>
    )
  }

  return (
    <thead className={styles.tableHeader}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers
            .filter((header) => header.column.getIsVisible())
            .map(renderHeaderCell)}
        </tr>
      ))}
    </thead>
  )
}

import React, {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useCallback
} from 'react'
import _ from 'lodash'
import {
  EMPTY_STRING,
  SAVED_HIDDEN,
  FILTER_CHANGE_LISTENER,
  FILTER_LISTENER,
  NOP,
  SEVERITIES,
  SAVED_RESIZED,
  SAVED_RESIZING_ENABLED,
  COLUMN_RESIZING_LISTENER
} from '../../consts'
import Tooltip from '../Tooltip'
import {
  Arrow,
  LastArrow,
  LongArrow,
  ClearFilters,
  ThinArrow,
  ColumnResize,
  ColumnResizeReset
} from '../../svgs'
import clsx from 'clsx'
import {
  Row,
  Column as RTColumn,
  UseExpandedRowProps,
  UseRowStateRowProps,
  CellProps,
  HeaderGroup,
  useTable,
  usePagination,
  useFilters,
  useFlexLayout,
  useSortBy,
  useExpanded,
  useGlobalFilter,
  useRowState,
  Filters,
  useGroupBy,
  useResizeColumns
} from 'react-table'
import { IconButton } from '@mui/material'
import Utils from '../../utils'
import localStorageService from '../../localStorageService'
import ShowColumns from './ShowColumns'
import ActionsCell from './cells/ActionsCell'
import DefaultCell from './cells/DefaultCell'
import IconButtonCell from './cells/IconButtonCell'
import FilterBox from '../FilterBox'
import Loader from '../Loader'
import { useUrlFilters, useExplicitlyRemovedFilters } from './hooks'
import SelectFilter from './filters/SelectFilter'
import MultiSelectFilter from './filters/MultiSelectFilter'
import DateFilter from './filters/DateFilter'
import SeverityFilter from './filters/SeverityFilter'
import TextFilter from './filters/TextFilter'
import { UrlFilterParser } from './hooks/useUrlFilters'
import { useToggle } from '../../hooks'

import './table.scss'

const sortTypes = {
  length: (rowA: Row, rowB: Row, colId: string) => {
    const valALength = rowA.values[colId].length
    const valBLength = rowB.values[colId].length
    if (valALength === valBLength) {
      return 0
    }
    return valALength > valBLength ? 1 : -1
  }
}

export const filterParsersMap = new Map<FilterComponent, UrlFilterParser>()
export const stringParser: UrlFilterParser = (rawValue) => {
  if (Array.isArray(rawValue) && rawValue[0]) {
    return rawValue[0]
  }
  return null
}

const arrayParser: UrlFilterParser = (rawValue) =>
  Array.isArray(rawValue) ? rawValue : null

filterParsersMap.set(DateFilter, (rawValue) => {
  if (
    !Utils.isObject(rawValue) ||
    (!rawValue?.startTime?.[0] && !rawValue?.endTime?.[0])
  ) {
    return null
  }

  return {
    startTime: rawValue?.startTime?.[0],
    endTime: rawValue?.endTime?.[0]
  }
})

filterParsersMap.set(MultiSelectFilter, arrayParser)
filterParsersMap.set(SelectFilter, stringParser)
filterParsersMap.set(SeverityFilter, (rawValue) =>
  typeof rawValue === 'string' && SEVERITIES.includes(rawValue)
    ? rawValue
    : null
)
filterParsersMap.set(TextFilter, stringParser)

export type FilterComponent =
  | typeof DateFilter
  | typeof MultiSelectFilter
  | typeof SelectFilter
  | typeof SeverityFilter
  | typeof TextFilter

export interface RowAction {
  hideAction: boolean | ((original: object) => boolean)
  action?: ((original: object) => void) | (() => void)
  content?: string | ((original: object) => HTMLElement)
  disabled?: boolean | ((original: object) => boolean)
  text?: string
}

export interface CustomRowAction {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  disabled?: boolean | ((original: object) => boolean)
  onClick: ((original: object) => void) | (() => void)
  tooltipText?: any
  extraClass?: string
}

export interface CustomCellProps<Data extends Record<string, unknown>> {
  cell: CellProps<Data>
  column: Column<Data>
}

export type Column<Data extends Record<string, unknown>> = Omit<
  RTColumn<Data>,
  'Filter' | 'Cell' | 'id' | 'accessor'
> & {
  // if provided doesn't trigger row click
  onClickCell?: (values: Data) => void
  Cell?: React.FC<CustomCellProps<Data>>
  defaultHidden?: boolean
  Filter?: FilterComponent
  filter?:
    | string
    | ((
        rows: Row<Data>[],
        columnIds: string[],
        filterValue: any
      ) => Row<Data>[])
  sortType?:
    | 'number'
    | ((
        rowA: Row<Data>,
        rowB: Row<Data>,
        columnId: string,
        desc: boolean
      ) => number)
} & (
    | {
        id?: string
        accessor: string
      }
    | {
        id: string
        accessor: (originalRow: Data, rowIndex: number) => unknown
      }
  )

export interface ExtendedRow<T extends object>
  extends Row,
    UseExpandedRowProps<T>,
    UseRowStateRowProps<T> {
  subRows: Array<Row<any>>
}

type ExtendedHeaderGroup = HeaderGroup & {
  tooltip?: string
  disableSort?: boolean
  isSortedDesc?: boolean
  Filter?: ReactNode
  isSorted?: boolean
  disableResize?: boolean
}

interface TableProps<Data extends Record<string, unknown>> {
  columns: Column<Data>[]
  data: Data[]
  filterCategory: string
  title?: string
  maxRows?: number
  rowActions?: RowAction[]
  emptyMessage?: string
  tableActions?: Array<ReactNode>
  defaultSort?: string
  globalFilter?: string | ((rows: Array<Row>) => Row[])
  defaultGlobalFilter?: string
  checkRowSelected?: (row: object) => boolean
  checkRowHighlighted?: (row: object) => boolean
  getRowId?: (
    originalRow: object,
    relativeIndex: number,
    parent?: Row<object> | undefined
  ) => string
  addFilterToUrl?: boolean
  RowSubComponent?: React.FC<{ row: any }>
  listenerPrefix?: string
  onRowClick?: (row?: Row) => void
  miniTable?: boolean
  fixedPageSize?: number
  disableActionsPortal?: boolean
  colPropForShowColumns?: string
  manualPagination?: boolean
  itemsAmount?: number
  canExpandAll?: boolean
  loading?: boolean
  onFiltersChanged?: (newFilters: Filters<object>) => void
  defaultDescendingSort?: boolean
  customRowActions?: CustomRowAction[]
  manualFilters?: boolean
  initialFilters?: Filter[]
  extraClasses?: {
    tableWrapper?: string
    tableLine?: string
    expandCell?: string
    tableCell?: string
  }
  /**
   * Must be memoized
   */
  groupBy?: string[]
  hasCustomDateFormat?: boolean
  customDateFormat?: string
  hasResizableColumns?: boolean
  hasEmptyActionsCell?: boolean
  collapseRowsOnLeavingPage?: boolean
  onSortChanged: (sort: { id: string; desc?: boolean }) => void
  manualSorting?: boolean
}

function Table<Values extends Record<string, unknown>>({
  columns,
  data,
  rowActions = [],
  tableActions,
  title,
  defaultSort = EMPTY_STRING,
  globalFilter,
  defaultGlobalFilter = EMPTY_STRING,
  checkRowSelected,
  checkRowHighlighted,
  getRowId,
  addFilterToUrl,
  RowSubComponent,
  listenerPrefix,
  onRowClick = NOP,
  miniTable,
  filterCategory,
  fixedPageSize,
  disableActionsPortal,
  maxRows,
  emptyMessage,
  colPropForShowColumns,
  manualPagination,
  itemsAmount,
  canExpandAll = false,
  loading,
  onFiltersChanged,
  defaultDescendingSort = false,
  customRowActions,
  onSortChanged,
  manualSorting,
  manualFilters,
  extraClasses,
  initialFilters: initialUserFilters,
  groupBy,
  hasCustomDateFormat,
  customDateFormat,
  hasResizableColumns = false,
  hasEmptyActionsCell = false,
  collapseRowsOnLeavingPage = false
}: TableProps<Values>) {
  const extendedInitialUserFilters: ExtendedFilter[] | undefined = useMemo(
    () =>
      initialUserFilters?.map((filter) => ({ ...filter, defaultFilter: true })),
    [initialUserFilters]
  )

  const LSHidden = localStorageService.getItem(SAVED_HIDDEN)
  const hiddenInLocalStorage =
    (LSHidden && JSON.parse(LSHidden)[filterCategory]) ||
    columns
      .filter(({ defaultHidden }) => defaultHidden)
      .map(({ Header, accessor }) =>
        Utils.isString(accessor) ? accessor : Header
      )
  const LSResizing = localStorageService.getItem(SAVED_RESIZED)
  const initialResizing = (LSResizing &&
    JSON.parse(LSResizing)[filterCategory]) || { columnWidths: {} }

  const defaultColumn = React.useMemo(
    () => ({
      Cell: DefaultCell,
      width: 100,
      sortType: Utils.stringSort
    }),
    []
  )

  const [explicitlyRemovedFilters, updateExplicitlyRemovedFilters] =
    useExplicitlyRemovedFilters(extendedInitialUserFilters)

  const urlFilterConfig = useMemo(
    () =>
      columns.flatMap((col) => {
        const filterParser = filterParsersMap.get(col.Filter)
        const id = col.id ?? col.accessor

        if (!filterParser || typeof id !== 'string') {
          return []
        }

        return {
          id,
          filterParser
        }
      }),
    [columns]
  )

  const [urlFilters, setUrlFilters] = useUrlFilters({
    enabled: addFilterToUrl,
    filterConfig: urlFilterConfig,
    filterCategory
  })
  const [allRowsExpanded, toggleAllRowsExpanding] = useToggle(false)

  const LSEnabledResizing = localStorageService.getItem(SAVED_RESIZING_ENABLED)
  const enabledResizingInLocalStorage =
    LSEnabledResizing &&
    Object.keys(JSON.parse(LSEnabledResizing)).includes(filterCategory)
      ? JSON.parse(LSEnabledResizing)[filterCategory]
      : hasResizableColumns
  const [isResizable, toggleResizable] = useToggle(
    enabledResizingInLocalStorage
  )

  const { current: initialUrlFilters = [] } = useRef(urlFilters)

  const initialFilters = useMemo(() => {
    if (!extendedInitialUserFilters) {
      return initialUrlFilters
    }

    return [...extendedInitialUserFilters]
      .filter(({ id }) => !explicitlyRemovedFilters.has(id))
      .filter(
        ({ id }) => !initialUrlFilters.find((urlFilter) => urlFilter.id === id)
      )
      .concat(initialUrlFilters)
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    allColumns,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    toggleSortBy,
    gotoPage,
    nextPage,
    setPageSize,
    previousPage,
    page,
    state: { pageIndex, filters, columnResizing, sortBy },
    setFilter,
    setAllFilters,
    visibleColumns,
    setHiddenColumns,
    getToggleAllRowsExpandedProps,
    isAllRowsExpanded,
    resetResizing
  } = useTable(
    {
      columns,
      data,
      manualPagination,
      defaultColumn,
      globalFilter,
      initialState: {
        pageSize: fixedPageSize || 50,
        ...(defaultSort && {
          sortBy: [{ id: defaultSort, desc: defaultDescendingSort }]
        }),
        filters: initialFilters,
        globalFilter: defaultGlobalFilter,
        hiddenColumns: hiddenInLocalStorage,
        groupBy,
        columnResizing: initialResizing
      },
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetExpanded:
        collapseRowsOnLeavingPage && !allRowsExpanded && manualPagination,
      autoResetPage: false,
      autoResetRowState: false,
      autoResetGlobalFilter: false,
      autoResetHiddenColumns: false,
      autoResetResize: false,
      paginateExpandedRows: false,
      getRowId,
      sortTypes,
      manualSortBy: manualSorting,
      manualFilters
    },
    useRowState,
    useFilters,
    ...(groupBy ? [useGroupBy] : []),
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useFlexLayout,
    useResizeColumns
  )

  const onSortChangedRef = useRef(onSortChanged)
  onSortChangedRef.current = onSortChanged

  useEffect(() => {
    onSortChangedRef.current?.(sortBy[0])
  }, [sortBy])

  useEffect(() => {
    updateExplicitlyRemovedFilters(filters)
  }, [filters])

  useEffect(() => {
    if (hasResizableColumns) {
      localStorageService.updateResized(filterCategory, columnResizing)
      Utils.dispatchCustomEvent(COLUMN_RESIZING_LISTENER, undefined)
    }
  }, [JSON.stringify(columnResizing), filterCategory, hasResizableColumns])

  useEffect(() => {
    if (hasResizableColumns) {
      localStorageService.updateResizedEnabled(filterCategory, isResizable)
    }
  }, [isResizable, filterCategory, hasResizableColumns])

  const isEmpty = !rows.length
  const tableClass = clsx({
    'empty-table': isEmpty,
    'react-table': true
  })
  const wrapperClasses = clsx({
    'mini-table': miniTable,
    'scroll-wrapper': true
  })
  const tableRef = useRef<null | HTMLDivElement>(null)
  const isExpandable = !!RowSubComponent

  const cleanFilters = useMemo(
    () =>
      filters.filter(({ id }) => allColumns.find((column) => id === column.id)),
    [filters]
  )

  interface ExtendedEvent extends Event {
    detail: {
      value: any
      id: any
    }
  }
  function addOrRemoveFromFilter(event: ExtendedEvent) {
    const { value, id } = event.detail
    const findFilter = filters.find((filter) => filter.id === id)?.value || []
    const newFilter = Array.isArray(findFilter) ? [...findFilter] : [findFilter]
    if (!newFilter?.includes(value)) {
      newFilter.push(value)
    } else {
      newFilter.splice(newFilter.indexOf(value), 1)
    }
    setFilter(id, Utils.isEmpty(newFilter) ? undefined : newFilter)
  }

  useEffect(() => {
    onFiltersChanged?.(filters)
    if (addFilterToUrl) {
      setUrlFilters(filters)
    }
  }, [filters, addFilterToUrl])

  useEffect(() => {
    setHiddenColumns((hiddenColumns) => {
      localStorageService.updateHidden(filterCategory, hiddenColumns)
      return hiddenColumns
    })
  }, [visibleColumns.length])

  useEffect(() => {
    if (listenerPrefix) {
      document.addEventListener(
        `${listenerPrefix}${FILTER_CHANGE_LISTENER}`,
        addOrRemoveFromFilter as EventListener
      )
      Utils.dispatchCustomEvent(`${listenerPrefix}${FILTER_LISTENER}`, filters)
      return () => {
        document.removeEventListener(
          `${listenerPrefix}${FILTER_CHANGE_LISTENER}`,
          addOrRemoveFromFilter as EventListener
        )
      }
    }
    return () => {}
  }, [filters])

  useEffect(() => {
    gotoPage(0)
  }, [pageCount])

  useEffect(() => {
    tableRef.current?.scrollTo(0, 0)
    if (collapseRowsOnLeavingPage && RowSubComponent && !isAllRowsExpanded) {
      rows.forEach((row) => {
        if (row.isExpanded) {
          row.toggleRowExpanded(false)
        }
      })
    }
  }, [pageIndex, rows])

  useEffect(() => {
    if (miniTable && !fixedPageSize) {
      setPageSize(rows.length)
    }
  }, [rows.length])

  useEffect(() => {
    if (fixedPageSize) {
      setPageSize(fixedPageSize)
    }
  }, [fixedPageSize])

  const calcNumberOfRows = useCallback(
    _.debounce(() => {
      const tableHeight = tableRef.current?.clientHeight
      if (tableHeight && !miniTable && !fixedPageSize) {
        setPageSize(tableHeight / 35)
      }
    }, 350),
    []
  )

  useEffect(() => {
    calcNumberOfRows()
    window.addEventListener('resize', calcNumberOfRows)
    return () => {
      window.removeEventListener('resize', calcNumberOfRows)
    }
  }, [])

  return (
    <div className={clsx('react-table-wrapper', extraClasses?.tableWrapper)}>
      {!miniTable && (
        <div className='table-top'>
          <div>
            <span className='heading-4'>{title}</span>
            <span className='sub-title bold'>
              {`${itemsAmount || rows.length} ${
                maxRows ? `(max ${maxRows})` : EMPTY_STRING
              }`}
            </span>
            {allColumns.length > 2 && (
              <ShowColumns
                columns={allColumns}
                colProperty={colPropForShowColumns || 'Header'}
              />
            )}
            {canExpandAll && isExpandable && (
              <span
                {...getToggleAllRowsExpandedProps()}
                className='table-manipulations-btn'
              >
                <Tooltip
                  data={isAllRowsExpanded ? 'Collapse all' : 'Expand all'}
                >
                  <IconButton onClick={toggleAllRowsExpanding}>
                    <ThinArrow
                      className={`${
                        isAllRowsExpanded ? 'rotate180' : EMPTY_STRING
                      }`}
                    />
                  </IconButton>
                </Tooltip>
              </span>
            )}
            {hasResizableColumns && (
              <span
                className={clsx({
                  ['table-manipulations-btn']: true,
                  ['resizing-btn-is-on']: isResizable
                })}
              >
                <Tooltip
                  data={`${isResizable ? 'Disable' : 'Enable'} column resizing`}
                >
                  <IconButton onClick={toggleResizable}>
                    <ColumnResize />
                  </IconButton>
                </Tooltip>
              </span>
            )}
            {hasResizableColumns && (
              <span className='table-manipulations-btn'>
                <Tooltip data='Reset column resizing'>
                  <IconButton onClick={resetResizing}>
                    <ColumnResizeReset />
                  </IconButton>
                </Tooltip>
              </span>
            )}
          </div>
          {!Utils.isEmpty(cleanFilters) && (
            <div className='table-filters'>
              {!Utils.isEmpty(cleanFilters) &&
                cleanFilters.map(({ id, value }) => (
                  <FilterBox
                    key={id}
                    name={id}
                    value={value}
                    onDelete={() => {
                      setFilter(id, undefined)
                    }}
                    hasCustomDateFormat={hasCustomDateFormat}
                    customDateFormat={customDateFormat}
                  />
                ))}
              <div className='table-filters-clear'>
                <Tooltip data='Clear Filters'>
                  <IconButton
                    onClick={() => {
                      setAllFilters([])
                    }}
                  >
                    <ClearFilters />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
          <div className='table-actions'>{tableActions}</div>
        </div>
      )}
      {!loading ? (
        <div className={wrapperClasses} ref={tableRef}>
          <table {...getTableProps()} className={tableClass}>
            <thead className='sticky-header'>
              {headerGroups.map((headerGroup) => {
                const { key, ...headerGroupProps } =
                  headerGroup.getHeaderGroupProps()
                return (
                  <tr {...headerGroupProps} key={key}>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    {isExpandable ? (
                      <th className='table-header header-cell-for-expandable' />
                    ) : null}
                    {headerGroup.headers.map((column: ExtendedHeaderGroup) => {
                      const { key, ...headerProps } = column.getHeaderProps()
                      return (
                        <th {...headerProps} key={key} className='table-header'>
                          <Tooltip data={column.tooltip}>
                            <span
                              className={clsx({
                                ['table-headline']: true,
                                ['disable-sort']: column.disableSort
                              })}
                              onClick={() => {
                                if (!column.disableSort) {
                                  toggleSortBy(
                                    column.id,
                                    column.isSortedDesc === undefined
                                      ? false
                                      : !column.isSortedDesc
                                  )
                                }
                              }}
                            >
                              {column.render('Header')}
                            </span>
                          </Tooltip>
                          {column.Filter ? column.render('Filter') : null}

                          {!column.disableSort &&
                            (column.isSorted ||
                              (!column.isSorted && !column.Header)) && (
                              <div
                                className={clsx(
                                  'table-sort',
                                  !column.isSorted &&
                                    !column.Header &&
                                    'table-sort-no-title'
                                )}
                                onClick={() =>
                                  toggleSortBy(column.id, !column.isSortedDesc)
                                }
                              >
                                {column.isSortedDesc ? (
                                  <LongArrow className='rotate180' />
                                ) : (
                                  <LongArrow />
                                )}
                              </div>
                            )}
                          {isResizable && !column.disableResize && (
                            <div
                              className={clsx({
                                ['column-resizer']: true,
                                ['column-resizer-is-resizing']:
                                  column.isResizing
                              })}
                              {...column.getResizerProps()}
                            />
                          )}
                        </th>
                      )
                    })}
                    {!Utils.isEmpty(customRowActions) &&
                      customRowActions.map(({ tooltipText }) => (
                        <th
                          className='table-header table-header-actions'
                          key={tooltipText}
                        >
                          {EMPTY_STRING}
                        </th>
                      ))}
                    {(!Utils.isEmpty(rowActions) ||
                      (hasEmptyActionsCell && isResizable)) && (
                      <th className='table-header table-header-actions'>
                        {EMPTY_STRING}
                      </th>
                    )}
                  </tr>
                )
              })}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className='table-body'
              emptymessage={
                emptyMessage || (title ? `No ${title}` : `No ${rows}`)
              }
            >
              {page.map((row) => {
                const extendedRow = row as ExtendedRow<object>
                prepareRow(extendedRow)
                const classes = clsx({
                  'table-line': true,
                  clickable: onRowClick !== NOP || isExpandable,
                  'is-expand': !extendedRow.isGrouped && extendedRow.isExpanded,
                  'is-selected': checkRowSelected?.(extendedRow.original),
                  'is-highlighted': checkRowHighlighted?.(extendedRow.original),
                  ...(extraClasses?.tableLine && {
                    [extraClasses.tableLine]: true
                  })
                })

                return (
                  <React.Fragment key={extendedRow.getRowProps().key}>
                    <tr {...extendedRow.getRowProps()} className={classes}>
                      {isExpandable && !groupBy && (
                        <td
                          className={clsx(
                            'expand-cell',
                            extraClasses?.expandCell
                          )}
                          onClick={() => {
                            if (RowSubComponent) {
                              extendedRow.getToggleRowExpandedProps().onClick()
                            } else if (onRowClick) {
                              onRowClick(extendedRow.original)
                            }
                          }}
                        >
                          {extendedRow.isExpanded ? (
                            <Arrow />
                          ) : (
                            <Arrow className='rotate270' />
                          )}
                        </td>
                      )}
                      {extendedRow.cells.map((cell, index) => {
                        const { key, ...cellProps } = cell.getCellProps()
                        const shouldShowAggregated = (() => {
                          if (cell.isAggregated) {
                            return true
                          }

                          if (!groupBy) {
                            return false
                          }

                          const cellGroupIndex = cell.column.groupedIndex
                          const currentGroupIndex = groupBy.indexOf(
                            row.groupByID
                          )

                          return (
                            cellGroupIndex > currentGroupIndex &&
                            cell.row.depth < cellGroupIndex
                          )
                        })()

                        return (
                          <td
                            key={key}
                            {...cellProps}
                            className={clsx(
                              'table-cell',
                              extraClasses?.tableCell
                            )}
                            onClick={() => {
                              if (row.isGrouped) {
                                row.toggleRowExpanded()
                              } else {
                                const onClickCell = columns[index]?.onClickCell

                                if (onClickCell) {
                                  onClickCell(extendedRow.original)
                                } else if (RowSubComponent) {
                                  extendedRow
                                    .getToggleRowExpandedProps()
                                    .onClick()
                                } else if (onRowClick) {
                                  onRowClick(extendedRow.original)
                                }
                              }
                            }}
                          >
                            {cell.isGrouped ? (
                              <>
                                <span className='expand-cell expand-group'>
                                  {extendedRow.isExpanded ? (
                                    <Arrow />
                                  ) : (
                                    <Arrow className='rotate270' />
                                  )}
                                </span>
                                {cell.render('Cell')}
                              </>
                            ) : shouldShowAggregated ? (
                              cell.render('Aggregated')
                            ) : cell.isPlaceholder ? null : (
                              <>
                                {groupBy &&
                                  RowSubComponent &&
                                  !row.isGrouped &&
                                  (index === 0 ||
                                    extendedRow.cells[index - 1]
                                      .isPlaceholder) && (
                                    <span className='expand-cell expand-group'>
                                      {extendedRow.isExpanded ? (
                                        <Arrow />
                                      ) : (
                                        <Arrow className='rotate270' />
                                      )}
                                    </span>
                                  )}
                                {cell.render('Cell')}
                              </>
                            )}
                          </td>
                        )
                      })}
                      {!Utils.isEmpty(customRowActions) &&
                        customRowActions.map((action) => (
                          <td className='td-actions' key={action.tooltipText}>
                            <IconButtonCell row={extendedRow} action={action} />
                          </td>
                        ))}
                      {(!Utils.isEmpty(rowActions) ||
                        (hasEmptyActionsCell && isResizable)) && (
                        <td className='td-actions'>
                          <ActionsCell
                            row={extendedRow}
                            actions={rowActions}
                            disablePortal={disableActionsPortal}
                          />
                        </td>
                      )}
                    </tr>
                    {extendedRow.isExpanded &&
                    !extendedRow.isGrouped &&
                    RowSubComponent ? (
                      <tr className='sub-table-line'>
                        <td>
                          <RowSubComponent row={extendedRow} />
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}

      {(!miniTable || fixedPageSize) && !manualPagination && (
        <div className='footer'>
          <div className='pagination-wrapper'>
            <div className='pagination'>
              <Tooltip data={canPreviousPage ? 'First Page' : EMPTY_STRING}>
                <LastArrow
                  onClick={() => gotoPage(0)}
                  className='rotate180'
                  disabled={!canPreviousPage}
                />
              </Tooltip>
              <Tooltip data={canPreviousPage ? 'Previous Page' : EMPTY_STRING}>
                <Arrow
                  onClick={previousPage}
                  className='rotate90'
                  disabled={!canPreviousPage}
                />
              </Tooltip>
              <span className='note'>
                {`${pageIndex + 1} / ${pageCount || 1}`}
              </span>
              <Tooltip data={canNextPage ? 'Next Page' : EMPTY_STRING}>
                <Arrow
                  onClick={nextPage}
                  className='rotate270'
                  disabled={!canNextPage}
                />
              </Tooltip>
              <Tooltip data={canNextPage ? 'Last Page' : EMPTY_STRING}>
                <LastArrow
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Table)

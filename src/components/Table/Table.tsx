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
  NOP
} from '../../consts'
import Tooltip from '../Tooltip'
import {
  Arrow,
  LastArrow,
  LongArrow,
  ClearFilters,
  ThinArrow
} from '../../svgs'
import classNames from 'classnames'
import {
  Row,
  Column,
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
  Filters
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
import { useUrlFilters } from './hooks'

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

export interface CustomCellProps {
  cell: CellProps<object>
}

type ExtendedColumn = Column & {
  defaultHidden?: boolean
}

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
}

interface TableProps {
  columns: ExtendedColumn[]
  data: Array<any>
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
  extraClass?: string
}

function Table({
  columns,
  data,
  rowActions = [],
  tableActions,
  title,
  defaultSort = EMPTY_STRING,
  globalFilter,
  defaultGlobalFilter,
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
  manualFilters,
  initialFilters: initialUserFilters
}: TableProps) {
  const LSHidden = localStorageService.getItem(SAVED_HIDDEN)
  const hiddenInLocalStorage =
    (LSHidden && JSON.parse(LSHidden)[filterCategory]) ||
    columns
      .filter(({ defaultHidden }) => defaultHidden)
      .map(({ Header, accessor }) =>
        Utils.isString(accessor) ? accessor : Header
      )

  const defaultColumn = React.useMemo(
    () => ({
      Cell: DefaultCell,
      width: 100,
      sortType: Utils.stringSort
    }),
    []
  )

  const columnIds = useMemo(
    () =>
      columns.flatMap((col) => {
        const id = col.id ?? col.accessor

        return typeof id === 'string' ? id : []
      }),
    [columns]
  )

  const [urlFilters, setUrlFilters] = useUrlFilters({
    enabled: addFilterToUrl,
    filterIds: columnIds,
    filterCategory
  })

  const { current: initialUrlFilters = [] } = useRef(urlFilters)

  const initialFilters = useMemo(
    () =>
      initialUserFilters
        ? [...initialUserFilters]
            .filter(
              ({ id }) =>
                !initialUrlFilters.find((urlFilter) => urlFilter.id === id)
            )
            .concat(initialUrlFilters)
        : initialUrlFilters,

    []
  )

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
    state: { pageIndex, filters },
    setFilter,
    setAllFilters,
    visibleColumns,
    setHiddenColumns,
    getToggleAllRowsExpandedProps,
    isAllRowsExpanded
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
        hiddenColumns: hiddenInLocalStorage
      },
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetExpanded: false,
      autoResetPage: false,
      autoResetRowState: false,
      autoResetGlobalFilter: false,
      autoResetHiddenColumns: false,
      getRowId,
      sortTypes,
      manualFilters
    },
    useRowState,
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useFlexLayout
  )
  const isEmpty = !rows.length
  const tableClass = classNames({
    'empty-table': isEmpty,
    'react-table': true
  })
  const wrapperClasses = classNames({
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
    if (addFilterToUrl) setUrlFilters(filters)
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
  }, [pageIndex])

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
    <div className={classNames('react-table-wrapper', extraClass)}>
      {!miniTable && (
        <div className='table-top'>
          <div>
            <span className='heading-4'>{title}</span>
            <span className='sub-title'>
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
                className='expand-all-icon'
              >
                <Tooltip
                  data={isAllRowsExpanded ? 'Collapse all' : 'Expand all'}
                >
                  <IconButton>
                    <ThinArrow
                      className={`${
                        isAllRowsExpanded ? 'rotate180' : EMPTY_STRING
                      }`}
                    />
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
                              className={`table-headline ${
                                column.disableSort
                                  ? 'disable-sort'
                                  : EMPTY_STRING
                              }`}
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
                                className={classNames(
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
                    {!Utils.isEmpty(rowActions) && (
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
                const classes = classNames({
                  'table-line': true,
                  clickable: onRowClick !== NOP || isExpandable,
                  'is-expand': extendedRow.isExpanded,
                  'is-selected': checkRowSelected?.(extendedRow.original),
                  'is-highlighted': checkRowHighlighted?.(extendedRow.original)
                })
                return (
                  <React.Fragment key={extendedRow.getRowProps().key}>
                    <tr {...extendedRow.getRowProps()} className={classes}>
                      {isExpandable && (
                        <td
                          className='expand-cell'
                          onClick={() => onRowClick(extendedRow.original)}
                          {...(!!RowSubComponent && {
                            onClick:
                              extendedRow.getToggleRowExpandedProps().onClick
                          })}
                        >
                          {extendedRow.isExpanded ? (
                            <Arrow />
                          ) : (
                            <Arrow className='rotate270' />
                          )}
                        </td>
                      )}
                      {extendedRow.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className='table-cell'
                          onClick={() => onRowClick(extendedRow.original)}
                          {...(!!RowSubComponent && {
                            onClick:
                              extendedRow.getToggleRowExpandedProps().onClick
                          })}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                      {!Utils.isEmpty(customRowActions) &&
                        customRowActions.map((action) => (
                          <td className='td-actions' key={action.tooltipText}>
                            <IconButtonCell row={extendedRow} action={action} />
                          </td>
                        ))}
                      {!Utils.isEmpty(rowActions) && (
                        <td className='td-actions'>
                          <ActionsCell
                            row={extendedRow}
                            actions={rowActions}
                            disablePortal={disableActionsPortal}
                          />
                        </td>
                      )}
                    </tr>
                    {extendedRow.isExpanded && RowSubComponent ? (
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

export default Table

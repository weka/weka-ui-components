import React, { ReactNode, useEffect, useMemo, useRef, useCallback } from 'react'
import _ from 'lodash'
import { EMPTY_STRING, SAVED_FILTERS, SAVED_HIDDEN, FILTER_CHANGE_LISTENER, FILTER_LISTENER, NOP } from '../../consts'
import Tooltip from '../Tooltip'
import { Arrow, LastArrow, LongArrow, ClearFilters } from '../../svgs'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
  useRowState
} from 'react-table'
import { IconButton } from '@mui/material'
import Utils from '../../utils'
import localStorageService from '../../localStorageService'
import ShowColumns from './ShowColumns'
import ActionsCell from './cells/ActionsCell'
import DefaultCell from './cells/DefaultCell'
import FilterBox from '../FilterBox'

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

function parseURLFilters(search: any) {
  const params = new URLSearchParams(search)
  return [...params.entries()].map(([id, value]) => ({ id, value }))
}

interface ParsedFilter {
  id: any
  value: any
}

function formatParsedFilters(parsedFilters: ParsedFilter[]) {
  return parsedFilters.reduce((acc, { id, value }) => {
    const foundFilter: { [key: string]: any } | undefined = acc.find((filter: { [key: string]: any }) => filter.id === id)
    if (!foundFilter) {
      acc.push({ id, value: [value] })
    } else {
      foundFilter.value.push(value)
    }
    return acc
  }, [])
}

export interface RowAction {
  hideAction: boolean | ((original: object) => boolean)
  action?: ((original: object) => void) | (() => void)
  content?: string | ((original: object) => HTMLElement)
  disabled?: boolean | ((original: object) => boolean)
  text?: string
}

export interface CustomCellProps {
  cell: CellProps<object>
}


type ExtendedColumn = Column & {
  defaultHidden?: boolean
}

export interface ExtendedRow<T extends object> extends Row, UseExpandedRowProps<T>, UseRowStateRowProps<T> {
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
  getRowId?: ((originalRow: object, relativeIndex: number, parent?: (Row<object> | undefined)) => string)
  addFilterToUrl?: boolean
  RowSubComponent?: React.FC<{row: any}>
  listenerPrefix?: string
  onRowClick?: (row?: Row) => void
  miniTable?: boolean
  fixedPageSize?: number
  disableActionsPortal?: boolean
  colPropForShowColumns?: string
  extraClass?: string
}

function Table({
  columns, data, rowActions = [], tableActions, title, defaultSort = EMPTY_STRING, globalFilter, defaultGlobalFilter, checkRowSelected, getRowId,
  addFilterToUrl, RowSubComponent, listenerPrefix, onRowClick = NOP, miniTable, filterCategory, fixedPageSize, disableActionsPortal, maxRows, emptyMessage, colPropForShowColumns, extraClass
}: TableProps) {
  const LSFilters = localStorageService.getItem(SAVED_FILTERS)
  const filtersInLocalStorage = (LSFilters && JSON.parse(LSFilters)[filterCategory]) || EMPTY_STRING

  const [searchParams] = useSearchParams()

  const LSHidden = localStorageService.getItem(SAVED_HIDDEN)
  const hiddenInLocalStorage = (LSHidden && JSON.parse(LSHidden)[filterCategory])
    || columns.filter(({ defaultHidden }) => defaultHidden).map(({ Header, accessor }) => (Utils.isString(accessor) ? accessor : Header))

  const defaultColumn = React.useMemo(() => ({
    Cell: DefaultCell,
    width: 100,
    sortType: Utils.stringSort
  }), [])

  const navigate = useNavigate()
  const urlFilters = addFilterToUrl ? useMemo(() => parseURLFilters(window.location.search ? searchParams : Utils.parseParamsToQuery(filtersInLocalStorage)), []) : []
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
    setHiddenColumns
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      globalFilter,
      initialState: {
        pageSize: fixedPageSize || 50,
        ...(defaultSort && { sortBy: [{ id: defaultSort, desc: false }] }),
        filters: formatParsedFilters(urlFilters),
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
      sortTypes
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

  const cleanFilters = useMemo(() => filters.filter(({ id }) => allColumns.find((column) => id === column.id)), [filters])

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
    setHiddenColumns((hiddenColumns) => {
      localStorageService.updateHidden(filterCategory, hiddenColumns)
      return hiddenColumns
    })
  }, [visibleColumns.length])

  useEffect(() => {
    if (listenerPrefix) {
      document.addEventListener(`${listenerPrefix}${FILTER_CHANGE_LISTENER}`, addOrRemoveFromFilter as EventListener)
      Utils.dispatchCustomEvent(`${listenerPrefix}${FILTER_LISTENER}`, filters)
      return () => {
        document.removeEventListener(`${listenerPrefix}${FILTER_CHANGE_LISTENER}`, addOrRemoveFromFilter as EventListener)
      }
    }
    return () => {}
  }, [filters])

  useEffect(() => {
    if (addFilterToUrl) {
      const formatFilters = cleanFilters.reduce((acc: {[key: string]: any}, { id, value }) => {
        acc[id] = value
        return acc
      }, {})
      const queryParams = Utils.parseParamsToQuery(formatFilters)
      navigate({ search: queryParams.toString() }, { replace: true })
      localStorageService.updateFilters(filterCategory, formatFilters)
    }
  }, [cleanFilters])

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

  const calcNumberOfRows = useCallback(_.debounce(() => {
    const tableHeight = tableRef.current?.clientHeight
    if (tableHeight && !miniTable && !fixedPageSize) {
      setPageSize(tableHeight / 35)
    }
  }, 350), [])

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
            <span className='sub-title'>{`${rows.length} ${maxRows ? `(max ${maxRows})` : EMPTY_STRING}`}</span>
            {allColumns.length > 2 && <ShowColumns columns={allColumns} colProperty={colPropForShowColumns || 'Header'} />}
          </div>
          {!Utils.isEmpty(cleanFilters) && (
            <div className='table-filters'>
              {cleanFilters.map(({ id, value }) => <FilterBox key={id} name={id} text={value} onDelete={() => setFilter(id, undefined)} />)}
              <div className='table-filters-clear'>
                <Tooltip data='Clear Filters'>
                  <IconButton onClick={() => setAllFilters([])}>
                    <ClearFilters />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
          <div className='table-actions'>
            {tableActions}
          </div>
        </div>
      )}
      <div className={wrapperClasses} ref={tableRef}>
        <table {...getTableProps()} className={tableClass}>
          <thead className='sticky-header'>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                {isExpandable ? <th className='table-header header-cell-for-expandable' /> : null}
                {headerGroup.headers.map((column: ExtendedHeaderGroup) => (
                  <th {...column.getHeaderProps()} className='table-header'>
                    <Tooltip data={column.tooltip}>
                      <span
                        className={`table-headline ${column.disableSort ? 'disable-sort' : EMPTY_STRING}`}
                        onClick={() => {
                          if (!column.disableSort) {
                            toggleSortBy(column.id, column.isSortedDesc === undefined ? false : !column.isSortedDesc)
                          }
                        }}
                      >
                        {column.render('Header')}
                      </span>
                    </Tooltip>
                    {column.Filter ? column.render('Filter') : null}
                    {column.isSorted
                    && (
                      <div
                        className='table-sort'
                        onClick={() => toggleSortBy(column.id, !column.isSortedDesc)}
                      >
                        {column.isSortedDesc ? <LongArrow className='rotate180' /> : <LongArrow />}
                      </div>
                    )}
                  </th>
                ))}
                {!Utils.isEmpty(rowActions) && (
                  <th className='table-header table-header-actions'>{EMPTY_STRING}</th>
                )}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className='table-body' emptymessage={emptyMessage || (title ? `No ${title}` : `No ${rows}`)}>
            {page.map((row) => {
              const extendedRow = row as ExtendedRow<object>
              prepareRow(extendedRow)
              const classes = classNames({
                'table-line': true,
                clickable: onRowClick !== NOP || isExpandable,
                'is-expand': extendedRow.isExpanded,
                'is-selected': checkRowSelected?.(extendedRow.original)
              })
              return (
                <React.Fragment key={extendedRow.getRowProps().key}>
                  <tr
                    {...extendedRow.getRowProps()}
                    className={classes}
                  >
                    {isExpandable
                      && (
                        <td
                          className='expand-cell'
                          onClick={() => onRowClick(extendedRow.original)}
                          {...(!!RowSubComponent && { onClick: extendedRow.getToggleRowExpandedProps().onClick })}
                        >
                          {extendedRow.isExpanded
                            ? <Arrow />
                            : <Arrow className='rotate270' />}
                        </td>
                      )}
                    {extendedRow.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className='table-cell'
                        onClick={() => onRowClick(extendedRow.original)}
                        {...(!!RowSubComponent && { onClick: extendedRow.getToggleRowExpandedProps().onClick })}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                    {!Utils.isEmpty(rowActions) && (
                      <td className='td-actions'>
                        <ActionsCell row={extendedRow} actions={rowActions} disablePortal={disableActionsPortal} />
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
      {(!miniTable || fixedPageSize) && (
        <div className='footer'>
          <div className='pagination-wrapper'>
            <div className='pagination'>
              <Tooltip data={canPreviousPage ? 'First Page' : EMPTY_STRING}>
                <LastArrow onClick={() => gotoPage(0)} className='rotate180' disabled={!canPreviousPage} />
              </Tooltip>
              <Tooltip data={canPreviousPage ? 'Previous Page' : EMPTY_STRING}>
                <Arrow onClick={previousPage} className='rotate90' disabled={!canPreviousPage} />
              </Tooltip>
              <span className='note'>
                {`${pageIndex + 1} / ${pageCount || 1}`}
              </span>
              <Tooltip data={canNextPage ? 'Next Page': EMPTY_STRING}>
                <Arrow onClick={nextPage} className='rotate270' disabled={!canNextPage} />
              </Tooltip>
              <Tooltip data={canNextPage ? 'Last Page' : EMPTY_STRING}>
                <LastArrow onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table

import React from 'react'
import { ExtendedTable } from '../../types'
import Tooltip from '../../../Tooltip'
import ShowColumns from './ShowColumns'
import { IconButton } from '@mui/material'
import {
  ClearFilters,
  ColumnResize,
  ColumnResizeReset,
  ThinArrow
} from '../../../../svgs'
import { Utils } from '../../../..'
import FilterBox from './FilterBox'
import { EMPTY_STRING } from '../../../../consts'
import clsx from 'clsx'

interface TableTopProps<Data> {
  table: ExtendedTable<Data>
  title?: string
  itemsAmount?: number
  maxRows?: number
  canExpandAll: boolean
  isExpandable: boolean
  tableActions: any
  hasResizableColumns: boolean
  isResizable: boolean
  toggleResizable: () => void
  hasCustomDateFormat?: boolean
  customDateFormat?: string
  toggleAllRowsExpanding: () => void
}

export function TableTop<Data>(props: TableTopProps<Data>) {
  const {
    title,
    itemsAmount,
    maxRows,
    table,
    canExpandAll,
    isExpandable,
    tableActions,
    hasResizableColumns,
    isResizable,
    toggleResizable,
    hasCustomDateFormat,
    customDateFormat,
    toggleAllRowsExpanding
  } = props

  const { columnFilters } = table.getState()
  const isAllRowsExpanded = table.getIsAllRowsExpanded()
  const allColumns = table.getAllColumns()

  return (
    <div className='table-top'>
      <div className='table-top-controls'>
        <span className='heading-4'>{title}</span>
        <span className='sub-title bold'>
          {`${itemsAmount || table.getRowCount()} ${
            maxRows ? `(max ${maxRows})` : EMPTY_STRING
          }`}
        </span>
        {allColumns.length > 2 && <ShowColumns table={table} />}
        {canExpandAll && isExpandable && (
          <span className='table-manipulations-btn'>
            <Tooltip data={isAllRowsExpanded ? 'Collapse all' : 'Expand all'}>
              <IconButton
                onClick={() => {
                  table.toggleAllRowsExpanded()
                  toggleAllRowsExpanding()
                }}
              >
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
              <IconButton onClick={() => table.resetColumnSizing()}>
                <ColumnResizeReset />
              </IconButton>
            </Tooltip>
          </span>
        )}
      </div>
      {!Utils.isEmpty(columnFilters) && (
        <div className='table-filters'>
          {allColumns.map(
            (column) =>
              column.getIsFiltered() && (
                <FilterBox
                  key={column.id}
                  column={column}
                  hasCustomDateFormat={hasCustomDateFormat}
                  customDateFormat={customDateFormat}
                />
              )
          )}
          <div className='table-filters-clear'>
            <Tooltip data='Clear Filters'>
              <IconButton
                onClick={() => {
                  table.setColumnFilters([])
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
  )
}

export default TableTop

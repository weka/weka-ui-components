import React, { useMemo } from 'react'
import { DateTime } from 'luxon'
import svgs from 'svgs'
import { EMPTY_STRING, FILTERBOXES, TIME_FORMATS } from 'consts'
import utils from 'utils'
import { ExtendedColumn } from '../../../types'
import {
  tableUtils,
  isTextFilterValue,
  isSelectFilterValue,
  isMultiSelectFilterValue,
  TextFilterValue,
  SelectFilterMode
} from '../../../tableUtils'
import {
  DateFilterValue,
  isDateFilterValue,
  isDurationFilterValue
} from '../../filters'

import './filterBox.scss'

const { Close } = svgs

const TEXT_FILTER_MODE_LABELS: Record<TextFilterValue['mode'], string> = {
  include: 'Include',
  exclude: 'Exclude',
  regex: 'Regex'
}

const SELECT_FILTER_MODE_LABELS: Record<SelectFilterMode, string> = {
  include: 'Include',
  exclude: 'Exclude'
}

const filterFormatters = {
  dateFilter: (
    { startTime, endTime }: DateFilterValue,
    hasCustomDateFormat: boolean,
    customDateFormat: string
  ) => {
    if (!startTime && !endTime) {
      return false
    }
    if (hasCustomDateFormat) {
      return `${
        startTime
          ? DateTime.fromISO(startTime).toFormat(customDateFormat)
          : 'Anytime'
      } → ${
        endTime
          ? DateTime.fromISO(endTime).toFormat(customDateFormat)
          : 'Anytime'
      }`
    }
    return `${
      startTime ? utils.formatISODate(startTime, false) : 'Anytime'
    } → ${endTime ? utils.formatISODate(endTime, false) : 'Anytime'}`
  }
} as const

interface FilterBoxProps<Data, Value> {
  column: ExtendedColumn<Data, Value>
  hasCustomDateFormat?: boolean
  customDateFormat?: string
}
function FilterBox<Data, Value>(props: FilterBoxProps<Data, Value>) {
  const {
    column,
    hasCustomDateFormat = false,
    customDateFormat = TIME_FORMATS.DATE_TIME_SECONDS
  } = props

  const columnTitle = tableUtils.getColumnTitle(column)
  const filterValue = column.getFilterValue()
  const onDelete = () => column.setFilterValue(undefined)

  const text = useMemo(() => {
    if (typeof filterValue === 'string') {
      return filterValue
    }

    if (Array.isArray(filterValue)) {
      return filterValue.join(', ')
    }

    if (isDateFilterValue(filterValue)) {
      return filterFormatters.dateFilter(
        filterValue,
        hasCustomDateFormat,
        customDateFormat
      )
    }

    if (isDurationFilterValue(filterValue)) {
      return `${filterValue.operator} ${filterValue.duration}`
    }

    if (isTextFilterValue(filterValue)) {
      return (
        <>
          <span className='filter-mode-label'>
            {TEXT_FILTER_MODE_LABELS[filterValue.mode]}:
          </span>{' '}
          <span className='filter-pattern'>{filterValue.pattern}</span>
        </>
      )
    }

    if (isSelectFilterValue(filterValue)) {
      return (
        <>
          <span className='filter-mode-label'>
            {SELECT_FILTER_MODE_LABELS[filterValue.mode]}:
          </span>{' '}
          <span className='filter-pattern'>{filterValue.value}</span>
        </>
      )
    }

    if (isMultiSelectFilterValue(filterValue)) {
      return (
        <>
          <span className='filter-mode-label'>
            {SELECT_FILTER_MODE_LABELS[filterValue.mode]}:
          </span>{' '}
          <span className='filter-pattern'>{filterValue.values.join(', ')}</span>
        </>
      )
    }

    throw new Error(`Unknown filter value: ${JSON.stringify(filterValue)}`)
  }, [customDateFormat, hasCustomDateFormat, filterValue])

  const formattedName = useMemo(() => {
    if (columnTitle.toUpperCase().replace(/\s/g, EMPTY_STRING) in FILTERBOXES) {
      return FILTERBOXES[
        `${columnTitle.toUpperCase().replace(/\s/g, EMPTY_STRING)}`
      ]
    }
    return columnTitle.split('_').join(' ')
  }, [columnTitle])

  return (
    <div className='box-filter-container'>
      <span className='filter-headline'>
        {formattedName}
        <Close onClick={onDelete} />
      </span>
      <span className='filter-data'>{text}</span>
    </div>
  )
}

export default FilterBox

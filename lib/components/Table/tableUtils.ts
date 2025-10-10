import { Utils } from '../../main'
import { EMPTY_STRING, SEVERITIES, Severities } from 'consts'
import utils from 'utils'
import { ExtendedColumn, ExtendedRow, UrlFilterParser } from './types'
import {
  type CompareOperator,
  COMPARE_OPERATORS
} from './components/filters/DurationFilter'
import { Duration } from 'luxon'

export const tableUtils = {
  getColumnTitle: <Data, Value>(column: ExtendedColumn<Data, Value>) => {
    const customTitle = column.columnDef.meta?.columnTitle

    return (
      customTitle ||
      (typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : column.columnDef.id ?? EMPTY_STRING)
    )
  },
  isAccessorColumn: <Data, Value>(column: ExtendedColumn<Data, Value>) =>
    'accessorFn' in column.columnDef || 'accessorKey' in column.columnDef
}

const uniqueCountCache = new Map<string, number>()

export const getUniqueCount = <Data>(
  row: ExtendedRow<Data>,
  columnId: string
): number => {
  const cacheKey = `${row.id}-${columnId}`

  if (uniqueCountCache.has(cacheKey)) {
    return uniqueCountCache.get(cacheKey) ?? 0
  }

  const count = row.getLeafRows().reduce<Set<unknown>>((acc, item) => {
    const value = item.getValue(columnId)

    if (!utils.isEmpty(value)) {
      acc.add(value)
    }

    return acc
  }, new Set()).size

  uniqueCountCache.set(cacheKey, count)

  return count
}

export const clearUniqueCountCache = () => {
  uniqueCountCache.clear()
}

const getSortValue = <Data>(
  row: ExtendedRow<Data>,
  columnId: string,
  grouping?: string[]
): { value: string | number; isAggregated: boolean; fallbackName?: string } => {
  const isLastGroupingLevel =
    !grouping ||
    grouping.length === 0 ||
    (row.groupingColumnId &&
      grouping.indexOf(row.groupingColumnId) === grouping.length - 1)

  if (isLastGroupingLevel) {
    return {
      value: row.getValue(columnId),
      isAggregated: false
    }
  }

  const count = getUniqueCount(row, columnId)

  return {
    value: count,
    isAggregated: true,
    fallbackName: row.getValue(row.groupingColumnId || columnId) ?? EMPTY_STRING
  }
}

export const getCustomSortingFns = (grouping?: string[]) => ({
  stringSort: <Data>(
    rowA: ExtendedRow<Data>,
    rowB: ExtendedRow<Data>,
    columnId: string
  ): number => {
    const resultA = getSortValue(rowA, columnId, grouping)
    const resultB = getSortValue(rowB, columnId, grouping)

    if (
      resultA.isAggregated &&
      resultB.isAggregated &&
      resultA.value === resultB.value
    ) {
      return (resultA?.fallbackName?.toString() || EMPTY_STRING).localeCompare(
        resultB?.fallbackName?.toString() || EMPTY_STRING
      )
    }

    let a = resultA.value ?? EMPTY_STRING
    let b = resultB.value ?? EMPTY_STRING

    if (typeof a === 'boolean' || typeof b === 'boolean') {
      return a > b ? -1 : a < b ? 1 : 0
    }

    if (utils.isNumber(a) && utils.isNumber(b)) {
      if (utils.isEmpty(a)) {
        return 1
      }
      if (utils.isEmpty(b)) {
        return -1
      }
      const numberA = parseFloat(a)
      const numberB = parseFloat(b)
      if (numberA === numberB) {
        return 0
      }
      return numberA > numberB ? 1 : -1
    }

    if (utils.isIp(a) || utils.isIp(b)) {
      if (utils.isEmpty(a)) {
        return 1
      }
      if (utils.isEmpty(b)) {
        return -1
      }
      const num1 = Number(
        a
          .split('.')
          .map((num: string) => `000${num}`.slice(-3))
          .join(EMPTY_STRING)
      )
      const num2 = Number(
        b
          .split('.')
          .map((num: string) => `000${num}`.slice(-3))
          .join(EMPTY_STRING)
      )
      return num1 - num2
    }

    if (!utils.isString(a) || !utils.isString(b)) {
      if (Array.isArray(a) && Array.isArray(b)) {
        a = a.length
        b = b.length
        if (!a) {
          return 1
        }
        if (!b) {
          return -1
        }
      }
      if (a === b) {
        return 0
      }
      return a > b ? 1 : -1
    }

    if (!a.length) {
      return 1
    }
    if (!b.length) {
      return -1
    }

    const collator = Intl.Collator(undefined, { numeric: true })
    return collator.compare(a, b)
  },
  numberSort: <Data>(
    rowA: ExtendedRow<Data>,
    rowB: ExtendedRow<Data>,
    columnId: string
  ): number => {
    const resultA = getSortValue(rowA, columnId, grouping)
    const resultB = getSortValue(rowB, columnId, grouping)

    if (
      resultA.isAggregated &&
      resultB.isAggregated &&
      resultA.value === resultB.value
    ) {
      return (resultA?.fallbackName?.toString() || EMPTY_STRING).localeCompare(
        resultB?.fallbackName?.toString() || EMPTY_STRING
      )
    }

    const a =
      typeof resultA.value === 'number' ? resultA.value : +(resultA.value || 0)
    const b =
      typeof resultB.value === 'number' ? resultB.value : +(resultB.value || 0)

    return a - b
  }
})

export const urlFilterParsers = {
  boolean: (rawValue: Parameters<UrlFilterParser>[0]) => {
    if (Array.isArray(rawValue) && rawValue[0]) {
      return rawValue[0] === 'true' ? true : false
    }

    return null
  },
  string: (rawValue: Parameters<UrlFilterParser>[0]) => {
    if (Array.isArray(rawValue) && rawValue[0]) {
      return rawValue[0]
    }
    return null
  },
  arrayOfStrings: (rawValue: Parameters<UrlFilterParser>[0]) =>
    Array.isArray(rawValue) ? rawValue : null,
  date: (rawValue: Parameters<UrlFilterParser>[0]) => {
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
  },
  severity: (rawValue: Parameters<UrlFilterParser>[0]) =>
    Array.isArray(rawValue) && SEVERITIES.includes(rawValue[0])
      ? rawValue[0]
      : null,
  duration: (rawValue: Parameters<UrlFilterParser>[0]) => {
    if (
      !Utils.isObject(rawValue) ||
      (!rawValue?.duration?.[0] && !rawValue?.operator?.[0])
    ) {
      return null
    }
    return {
      duration: rawValue?.duration?.[0],
      operator: rawValue?.operator?.[0]
    }
  }
} as const

export const filterFns = {
  multiSelect<Data>(
    row: ExtendedRow<Data>,
    columnId: string,
    filterValue: string[] | number[] | string
  ): boolean {
    if (!filterValue) {
      return false
    }
    if (Array.isArray(filterValue)) {
      return filterValue.some((val) => {
        const rowValue = row.getValue(columnId)

        return Array.isArray(rowValue)
          ? rowValue.some((item) => item?.toString() === val?.toString())
          : rowValue?.toString() === val?.toString()
      })
    }

    return filterValue?.toString() === row.getValue(columnId)?.toString()
  },
  date<Data>(
    row: ExtendedRow<Data>,
    columnId: string,
    { startTime, endTime }: { startTime?: string; endTime?: string }
  ): boolean {
    const valueTime = row.getValue(columnId) ?? 0
    if (typeof valueTime !== 'string') {
      throw new Error(
        `Date filter: value is not a string. ColumnId: ${columnId}`
      )
    }

    const valueDate = new Date(valueTime)

    if (startTime && endTime) {
      return new Date(endTime) >= valueDate && valueDate >= new Date(startTime)
    }

    if (startTime) {
      return valueDate >= new Date(startTime)
    }

    if (endTime) {
      return new Date(endTime) >= valueDate
    }

    return true
  },
  severity<Data>(
    row: ExtendedRow<Data>,
    columnId: string,
    filterValue: Severities
  ): boolean {
    const severity = row.getValue(columnId)

    const isSeverity = (value: any): value is Severities =>
      SEVERITIES.includes(value)

    if (!isSeverity(severity)) {
      throw new Error(
        `Severity filter: value is not a valid severity. Column ID: ${columnId}`
      )
    }

    const rowSeverityIndex = SEVERITIES.indexOf(severity)

    if (rowSeverityIndex === -1) {
      throw new Error(
        `Severity filter: value is not a valid severity. Column ID: ${columnId}`
      )
    }

    const selectedSeverityIndex = SEVERITIES.indexOf(filterValue)

    return rowSeverityIndex >= selectedSeverityIndex
  },
  duration<Data>(
    row: ExtendedRow<Data>,
    columnId: string,
    filterValue: { duration: string; operator: CompareOperator }
  ): boolean {
    const valueTime = row.getValue(columnId) as number

    const parts = filterValue.duration.split(' ')
    const durationObj: Record<string, number> = {}

    for (const part of parts) {
      const value = parseInt(part)
      const unit = part.replace(/[0-9]/g, EMPTY_STRING)

      const unitMap: Record<string, string> = {
        y: 'years',
        mon: 'months',
        w: 'weeks',
        d: 'days',
        h: 'hours',
        min: 'minutes',
        sec: 'seconds'
      }

      if (unitMap[unit]) {
        durationObj[unitMap[unit]] = value
      }
    }

    const duration = Duration.fromObject(durationObj)
    const filterSeconds = duration.as('seconds')

    const operators = {
      [COMPARE_OPERATORS['<']]: (a: number, b: number) => a < b,
      [COMPARE_OPERATORS['>']]: (a: number, b: number) => a > b,
      [COMPARE_OPERATORS['=']]: (a: number, b: number) => a === b
    }

    const compare = operators[filterValue.operator]

    return compare(valueTime, filterSeconds)
  }
} as const

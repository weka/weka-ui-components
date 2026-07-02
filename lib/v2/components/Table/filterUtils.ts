import type { NumRangeFilterType } from './NumberRange'
import type { FilterType } from '#v2/utils/consts'
import type { ReactNode } from 'react'

import { EMPTY_STRING, FILTER_TYPES } from '#v2/utils/consts'

/** Date range filter value with optional from/to dates */
export type DateRangeValue = { from?: string; to?: string }

/**
 * All filter value types the generic FilterPopover understands. Custom
 * (domain) filters carry their own object shapes, represented here as `object`.
 */
export type FilterValue =
  | string
  | string[]
  | DateRangeValue
  | NumRangeFilterType
  | object
  | undefined

/** Filter option with value and display label */
export interface FilterOption {
  value: string
  label: string
}

/** Configuration describing how a column's filter should render */
export interface FilterConfig {
  type: FilterType
  options?: FilterOption[]
  placeholder?: string
  autocompleteOptions?: string[]
  selectChips?: Record<string, ReactNode> | ReactNode[]
  startWithSearch?: boolean
  title?: string
  modeLabels?: { used?: string; total?: string }
  uppercaseValue?: boolean
}

/** An applied filter for a column */
export interface ActiveFilter {
  columnId: string
  type: FilterType
  value: FilterValue
  label: string
  modeLabels?: { used?: string; total?: string }
}

/** Metadata configuration for a column filter */
export interface FilterMeta {
  type?: string
  options?: unknown[] | { fixedOptions?: unknown[] }
  title?: string
  selectChips?: Record<string, ReactNode> | ReactNode[]
  startWithSearch?: boolean
  modeLabels?: { used?: string; total?: string }
  uppercaseValue?: boolean
}

/** Column definition with optional filter metadata */
export interface ColumnDef {
  id?: string
  accessorKey?: string
  accessorFn?: unknown
  meta?: { filter?: FilterMeta }
  header?: string | (() => string)
}

/** Column with optional id, accessorKey, accessorFn, and header */
export interface ColumnWithHeader {
  id?: string
  accessorKey?: string
  accessorFn?: { name?: string } | ((...args: unknown[]) => unknown)
  header?: string | (() => unknown)
}

/**
 * Gets the column ID from id, accessorKey, or accessorFn.name
 * @param col - The column definition
 * @returns The column ID or undefined
 */
export function getColumnId(col: ColumnWithHeader): string | undefined {
  const accessorFnName =
    col.accessorFn && 'name' in col.accessorFn ? col.accessorFn.name : undefined
  return col.id || col.accessorKey || accessorFnName
}

/**
 * Gets the column label from header, with fallback, first letter capitalized
 * @param column - The column definition
 * @param fallback - Fallback string if header is not a string
 */
export function getColumnLabel(
  column: ColumnWithHeader | undefined,
  fallback: string
): string {
  const label = typeof column?.header === 'string' ? column.header : fallback
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Checks if a value is undefined, null, or an empty string */
export function isEmptyPrimitive(
  value: unknown
): value is undefined | null | typeof EMPTY_STRING {
  return value === undefined || value === null || value === EMPTY_STRING
}

/** Checks if a value is an array with no elements */
export function isEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0
}

/** Type guard to check if an object is a date range value */
export function isDateRangeValue(value: object): value is DateRangeValue {
  return (
    'from' in value && 'to' in value && !('mode' in value) && !('min' in value)
  )
}

/** Checks if a date range has neither from nor to set */
export function isDateRangeEmpty(value: DateRangeValue): boolean {
  return !value.from && !value.to
}

/** Type guard to check if an object is a numeric range filter value */
export function isNumRangeValue(value: object): value is NumRangeFilterType {
  return 'min' in value && 'max' in value && !('mode' in value)
}

/** Checks if a numeric range has both min and max null */
export function isNumRangeEmpty(value: NumRangeFilterType): boolean {
  return value.min === null && value.max === null
}

/** Checks if a generic filter value is empty (primitive, array, date, num range) */
export function isFilterValueEmpty(value: FilterValue): boolean {
  if (isEmptyPrimitive(value)) {
    return true
  }
  if (isEmptyArray(value)) {
    return true
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  if (isDateRangeValue(value)) {
    return isDateRangeEmpty(value)
  }
  if (isNumRangeValue(value)) {
    return isNumRangeEmpty(value)
  }
  return false
}

/** Extracts the raw options array from array or fixedOptions object format */
export function getRawOptions(
  options: unknown[] | { fixedOptions?: unknown[] } | undefined
): unknown[] {
  if (Array.isArray(options)) {
    return options
  }
  if (options?.fixedOptions && Array.isArray(options.fixedOptions)) {
    return options.fixedOptions
  }
  return []
}

/** Normalizes options to FilterOption[], converting bare strings to {value,label} */
export function normalizeFilterOptions(
  options: unknown[] | { fixedOptions?: unknown[] } | undefined
): FilterOption[] {
  const rawOptions = getRawOptions(options)
  return rawOptions.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : (opt as FilterOption)
  )
}

/** Finds a column definition by id, accessorKey, or accessorFn */
export function findColumn(
  columns: unknown[],
  columnId: string
): ColumnDef | undefined {
  const cols = columns as ColumnDef[]
  let column = cols.find((col) => col.id === columnId)
  if (!column) {
    column = cols.find((col) => col.accessorKey === columnId)
  }
  if (!column) {
    column = cols.find(
      (col) => col.accessorFn && typeof col.accessorFn === 'function'
    )
  }
  return column
}

/** Creates a text filter configuration */
export function createTextFilter(columnId: string): FilterConfig {
  return { type: FILTER_TYPES.TEXT, placeholder: `Filter ${columnId}...` }
}

/** Creates a datetime filter configuration */
export function createDateTimeFilter(columnId: string): FilterConfig {
  return { type: FILTER_TYPES.DATETIME, placeholder: `Filter ${columnId}...` }
}

/** Creates a dropdown filter configuration */
export function createDropdownFilter(
  columnId: string,
  filterMeta: FilterMeta
): FilterConfig {
  return {
    type: FILTER_TYPES.DROPDOWN,
    options: normalizeFilterOptions(filterMeta.options),
    placeholder: filterMeta.title
      ? `Select ${filterMeta.title}...`
      : `Select ${columnId}...`,
    title: filterMeta.title,
    selectChips: filterMeta.selectChips,
    uppercaseValue: filterMeta.uppercaseValue
  }
}

/** Creates a multiselect filter configuration */
export function createMultiselectFilter(
  columnId: string,
  filterMeta: FilterMeta
): FilterConfig {
  return {
    type: FILTER_TYPES.MULTISELECT,
    options: normalizeFilterOptions(filterMeta.options),
    placeholder: `Select ${columnId}...`,
    selectChips: filterMeta.selectChips,
    startWithSearch: filterMeta.startWithSearch
  }
}

/** Map of filter type strings to their config builder functions */
const filterTypeHandlers: Record<
  string,
  (columnId: string, filterMeta: FilterMeta) => FilterConfig
> = {
  [FILTER_TYPES.DATETIME]: createDateTimeFilter,
  [FILTER_TYPES.DROPDOWN]: createDropdownFilter,
  select: createDropdownFilter,
  [FILTER_TYPES.MULTISELECT]: createMultiselectFilter,
  [FILTER_TYPES.CAPACITY_RANGE]: (_columnId, filterMeta) => ({
    type: FILTER_TYPES.CAPACITY_RANGE,
    modeLabels: filterMeta.modeLabels
  }),
  [FILTER_TYPES.NUM_RANGE]: () => ({ type: FILTER_TYPES.NUM_RANGE }),
  [FILTER_TYPES.REDUCTION_RANGE]: () => ({
    type: FILTER_TYPES.REDUCTION_RANGE
  })
}

/**
 * Creates a filter configuration based on the filter type in metadata.
 * Falls back to a text filter if the type is not recognized.
 */
export function createFilterConfigByType(
  columnId: string,
  filterMeta: FilterMeta
): FilterConfig {
  const handler = filterMeta.type ? filterTypeHandlers[filterMeta.type] : null
  if (handler) {
    return handler(columnId, filterMeta)
  }
  return createTextFilter(columnId)
}

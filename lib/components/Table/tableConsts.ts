import {
  DateFilter,
  MultiSelectFilter,
  SelectFilter,
  SeverityFilter,
  TextFilter
} from './components'
import { filterFns, urlFilterParsers } from './tableUtils'

export const ROW_HEIGHT = 52
export const ROWS_PER_PAGE_RATIO = 1.5

export const TABLE_FILTERS_MAP = {
  multiSelect: {
    component: MultiSelectFilter,
    parser: urlFilterParsers.arrayOfStrings,
    filterFn: filterFns.multiSelect
  },
  select: {
    component: SelectFilter,
    parser: urlFilterParsers.string,
    filterFn: 'equalsString'
  },
  date: {
    component: DateFilter,
    parser: urlFilterParsers.date,
    filterFn: filterFns.date
  },
  text: {
    component: TextFilter,
    parser: urlFilterParsers.string,
    filterFn: 'includesString'
  },
  severity: {
    component: SeverityFilter,
    parser: urlFilterParsers.severity,
    filterFn: filterFns.severity
  }
} as const

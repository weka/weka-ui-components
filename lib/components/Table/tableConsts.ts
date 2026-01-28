import {
  DateFilter,
  MultiSelectFilter,
  SelectFilter,
  SeverityFilter,
  TextFilter,
  DurationFilter
} from './components'
import { filterFns, urlFilterParsers } from './tableUtils'

export const ROW_HEIGHT = 52
export const ROWS_PER_PAGE_RATIO = 1.5

export const TABLE_FILTERS_MAP = {
  multiSelect: {
    component: MultiSelectFilter,
    parser: urlFilterParsers.multiSelect,
    filterFn: filterFns.multiSelect
  },
  select: {
    component: SelectFilter,
    parser: urlFilterParsers.select,
    filterFn: filterFns.select
  },
  date: {
    component: DateFilter,
    parser: urlFilterParsers.date,
    filterFn: filterFns.date
  },
  text: {
    component: TextFilter,
    parser: urlFilterParsers.text,
    filterFn: filterFns.text
  },
  severity: {
    component: SeverityFilter,
    parser: urlFilterParsers.severity,
    filterFn: filterFns.severity
  },
  duration: {
    component: DurationFilter,
    parser: urlFilterParsers.duration,
    filterFn: filterFns.duration
  }
} as const

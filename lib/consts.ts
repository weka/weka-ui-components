import {
  EventInfo,
  Warning,
  DebugWarning,
  AccidentMinor,
  AccidentMajor,
  AccidentCritical
} from './svgs'
import utils from './utils'

export const EMPTY_STRING = ''
export const ZERO_STRING = '0'
export const NOP = () => {}
export const TAG_SEPARATOR = ','

export const EVENT_KEYS = {
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
  TAB: 'Tab',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_LEFT: 'ArrowLeft',
  DOT: '.'
}
export const SAVED_FILTERS = 'saved_filters'
export const EXPLICITLY_REMOVED_FILTERS = 'explicitly_removed_filters'
export const SAVED_HIDDEN = 'saved_hidden'
export const SAVED_RESIZED = 'saved_resized_columns'
export const SAVED_RESIZING_ENABLED = 'saved_resizing_enabled'
export const FILTER_CHANGE_LISTENER = 'table-filters-change'
export const FILTER_LISTENER = 'table-filters'
export const COLUMN_RESIZING_LISTENER = 'column-resizing'

export const GENERAL_ERROR =
  'Something went wrong. Please refresh the page and try again.'

interface FilterBoxes {
  [key: string]: string
}

export const FILTERBOXES: FilterBoxes = {
  MINSEVERITY: 'Min Severity',
  SEVERITY: 'Min Severity',
  ACCESSPOINT: 'Access Point',
  FSNAME: 'Filesystem',
  FS: 'Filesystem',
  MOUNTOPTIONS: 'Mount Mode',
  AUTH_METHOD: 'Auth Method',
  LAST_ERRORS: 'Last Errors',
  INNERPATH: 'Inner Path',
  SHARENAME: 'Share Name',
  EXPIRY_DAYS: 'Expiration Days',
  POSIXUID: 'Posix UID',
  POSIXGID: 'Posix GID',
  S3POLICY: 'S3 Policy',
  SUPPORTEDVERSIONS: 'Supported Versions',
  NID: 'Process ID',
  NODEID: 'Process ID',
  RELATED_NODE_IDS: 'Related Processes',
  'INFO.CURLERRORSTR': 'Curl Errors',
  'INFO.KEY': 'Identifier',
  'INFO.CONCURRENCYATSTART': 'Concurrency Level',
  CHANTYPE: 'Operation Type',
  OPPHASE: 'Phase'
}

export const NODES_STATUSES = {
  DOWN: 'DOWN',
  FENCING: 'FENCING',
  UP: 'UP',
  JOINING: 'JOINING',
  SYNCING: 'SYNCING'
}

export const DRIVES_STATUSES = {
  INACTIVE: 'INACTIVE',
  PHASING_IN: 'PHASING_IN',
  ACTIVE: 'ACTIVE',
  PHASING_OUT: 'PHASING_OUT'
}

export const STATUS = {
  OK: 'OK',
  UP: 'UP',
  DEGRADED: 'DEGRADED',
  DOWN: 'DOWN',
  READY: 'READY',
  DEACTIVATING: 'DEACTIVATING',
  ACTIVE: 'ACTIVE',
  ENABLED: 'ENABLED',
  UPDATING: 'UPDATING',
  CREATING: 'CREATING',
  DOWNLOADING: 'DOWNLOADING',
  REMOVING: 'REMOVING',
  ADDING: 'ADDING'
}

export const OBS_IS_DETACHING = 'DETACHING'

export const OBS_MODES = {
  REMOTE: 'REMOTE',
  WRITABLE: 'WRITABLE',
  READ_ONLY: 'READ_ONLY'
}

// TIMES

interface TimeShortenings {
  [key: string]: any
}

export const TIME_PARTS_SHORTENINGS: TimeShortenings = {
  years: 'y',
  months: 'mon',
  weeks: 'w',
  days: 'd',
  hours: 'h',
  minutes: 'min',
  seconds: 'sec'
}

export const SHORT_DAY_OF_WEEK = 'Mon Tue Wed Thu Fri Sat Sun'.split(' ')

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const TIME_PARTS = {
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second'
}

export const TIME_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATE_TIME: 'yyyy-MM-dd HH:mm',
  DATE_TIME_SECONDS: 'yyyy-MM-dd HH:mm:ss',
  DATE_TIME_SECONDS_MS: 'yyyy-MM-dd HH:mm:ss.SSS'
}

interface SeverityIcons {
  [key: string]: any
}

export const SEVERITY_DEBUG = 'DEBUG'
export const SEVERITY_INFO = 'INFO'
export const SEVERITY_WARNING = 'WARNING'
export const SEVERITY_MINOR = 'MINOR'
export const SEVERITY_MAJOR = 'MAJOR'
export const SEVERITY_CRITICAL = 'CRITICAL'

export const SEVERITIES = [
  SEVERITY_DEBUG,
  SEVERITY_INFO,
  SEVERITY_WARNING,
  SEVERITY_MINOR,
  SEVERITY_MAJOR,
  SEVERITY_CRITICAL
] as const
export type Severities = (typeof SEVERITIES)[number]

export const SEVERITIES_ICONS: SeverityIcons = {
  INFO: EventInfo,
  WARNING: Warning,
  DEBUG: DebugWarning,
  MINOR: AccidentMinor,
  MAJOR: AccidentMajor,
  CRITICAL: AccidentCritical
} as const

interface ShortRoles {
  [key: string]: any
}

export const SHORT_ROLES: ShortRoles = {
  FRONTEND: 'FE',
  DRIVES: 'SSD',
  MANAGEMENT: 'MGMT'
}

export const PER_PAGE_OPTIONS = [
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
]

export const ORIGIN_OPTIONS = {
  USER: 'USER',
  WEKA: 'WEKA'
}

// CUSTOM EVENTS
export const STORAGE = 'storage'
export const SCHEME_CHANGE = 'schemeChange'

//ToasterDialog
export const DIALOG_STATUSES = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export const TOASTER_DIALOG = 'toasterDialog'
export const TOASTER_TYPES = {
  TOAST: 'toast',
  DIALOG: 'dialog'
} as const

export const DEFAULT_DEBOUNCE_DELAY = 700

export const ENCODING_TYPES = {
  text: 'text',
  binary: 'binary',
  base64: 'base64'
}

const FORMULA_TYPES = {
  EQUALS: 'equals',
  RANGE: 'range',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than'
} as const

export type Formula =
  | {
      type:
        | typeof FORMULA_TYPES.EQUALS
        | typeof FORMULA_TYPES.GREATER_THAN
        | typeof FORMULA_TYPES.LESS_THAN
      value: number
    }
  | { type: typeof FORMULA_TYPES.RANGE; from: number; to: number }

export const FORM_VALIDATIONS = {
  REQUIRED: 'required',
  POSITIVE: 'positive',
  NOT_NEGATIVE: 'not-negative',
  VALID_RANGE: (value: string) => {
    if (!value?.includes('-')) {
      return true
    }
    const range = value.split('.')[3]
    const [start, end] = range.split('-')
    if (parseInt(start, 10) > parseInt(end, 10)) {
      return 'Not a valid IP range'
    }
    return false
  },
  MAX_VALUE: (max: number, customErrorMsg?: string) => (val: number) => {
    if (val > max) {
      return customErrorMsg || `The maximum value is ${max}`
    }
    return false
  },
  MIN_VALUE: (min: number, customErrorMsg?: string) => (val: number) => {
    if (!utils.isEmpty(val) && val < min) {
      return customErrorMsg || `The minimum value is ${min}`
    }
    return false
  },
  MAX_LENGTH:
    (max: number, customErrorMsg?: string) => (val: string | string[]) => {
      if (val?.length > max) {
        return customErrorMsg || `The maximum length is ${max}`
      }
      return false
    },
  MIN_LENGTH:
    (min: number, customErrorMsg?: string) => (val: string | string[]) => {
      if (val?.length < min) {
        return customErrorMsg || `The minimum length is ${min}`
      }
      return false
    },
  REGEX_TEST: (regex: RegExp, customErrorMsg?: string) => (val: string) => {
    if (!utils.isEmpty(val) && !val?.match(regex)) {
      return customErrorMsg || `Expected format: ${regex}`
    }
    return false
  },
  MATCH_FORMULA:
    (restrictions: Formula[], customErrorMsg?: string) => (value: number) => {
      if (
        !restrictions.length ||
        restrictions.some(
          (restriction) =>
            ((restriction.type === FORMULA_TYPES.EQUALS ||
              restriction.type === FORMULA_TYPES.GREATER_THAN ||
              restriction.type === FORMULA_TYPES.LESS_THAN) &&
              utils.isEmpty(restriction.value)) ||
            (restriction.type === FORMULA_TYPES.RANGE &&
              utils.isEmpty(restriction.from) &&
              utils.isEmpty(restriction.to))
        )
      ) {
        return false
      }
      const getRestrictionFunc = (restriction: Formula) => {
        switch (restriction.type) {
          case FORMULA_TYPES.EQUALS:
            return value === restriction.value
          case FORMULA_TYPES.RANGE:
            return value >= restriction.from && value <= restriction.to
          case FORMULA_TYPES.GREATER_THAN:
            return value > restriction.value
          case FORMULA_TYPES.LESS_THAN:
            return value < restriction.value
          default:
            throw new Error(
              `Unknown restriction type: ${(restriction as Formula).type}`
            )
        }
      }
      const isInvalid = restrictions.every(
        (restriction) => !getRestrictionFunc(restriction)
      )
      if (!utils.isEmpty(value) && isInvalid) {
        return customErrorMsg || 'Invalid value'
      }
      return false
    }
}

import { EventInfo, Warning, DebugWarning, AccidentMinor, AccidentMajor, AccidentCritical } from './svgs'

export const EMPTY_STRING = ''
export const NOP = () => {}
export const TAG_SEPARATOR = ','
export const SAVED_FILTERS = 'saved_filters'
export const EXPLICITLY_REMOVED_FILTERS = 'explicitly_removed_filters'
export const SAVED_HIDDEN = 'saved_hidden'
export const SAVED_RESIZED = 'saved_resized'
export const SAVED_RESIZING_ENABLED = 'saved_resizing_enabled'
export const FILTER_CHANGE_LISTENER = 'table-filters-change'
export const FILTER_LISTENER = 'table-filters'

export const GENERAL_ERROR = 'Something went wrong. Please refresh the page and try again.'

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
  REMOVING: 'REMOVING'
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

export const SEVERITIES = [SEVERITY_DEBUG, SEVERITY_INFO, SEVERITY_WARNING, SEVERITY_MINOR, SEVERITY_MAJOR, SEVERITY_CRITICAL] as const
export type Severities = typeof SEVERITIES[number]

export const SEVERITIES_ICONS: SeverityIcons = {
  INFO: EventInfo,
  WARNING: Warning,
  DEBUG: DebugWarning,
  MINOR: AccidentMinor,
  MAJOR: AccidentMajor,
  CRITICAL: AccidentCritical
}

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

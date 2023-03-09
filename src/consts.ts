import { EventInfo, Warning, DebugWarning, AccidentMinor, AccidentMajor, AccidentCritical } from './svgs'

export const EMPTY_STRING = ''
export const NOP = () => {}
export const TAG_SEPARATOR = ','
export const SAVED_FILTERS = 'saved_filters'
export const SAVED_HIDDEN = 'saved_hidden'
export const FILTER_CHANGE_LISTENER = 'table-filters-change'
export const FILTER_LISTENER = 'table-filters'

export const GENERAL_ERROR = 'Something went wrong. Please refresh the page and try again.'

interface FilterBoxes {
    [key: string]: string
}

export const FILTERBOXES: FilterBoxes = {
    MINSEVERITY: 'Min Severity',
    NAME: 'Name',
    GROUP_NAME: 'Group Name',
    TIMESTAMP: 'Timestamp',
    CATEGORY: 'Category',
    EVENT: 'Event',
    ACCESSPOINT: 'Access Point',
    FSNAME: 'Filesystem',
    FS: 'Filesystem',
    MOUNTOPTIONS: 'Mount Mode',
    STATUS: 'Status',
    PROTOCOL: 'Protocol',
    REGION: 'Region',
    OBS_NAME: 'OBS Name',
    AUTH_METHOD: 'Auth Method',
    LAST_ERRORS: 'Last Errors',
    GROUP: 'Group',
    FILESYSTEM: 'Filesystem',
    PATH: 'Path',
    PERMISSION_TYPE: 'Permission Type',
    ANON_UID: 'Anon UID',
    ANON_GID: 'Anon GID',
    DESCRIPTION: 'Description',
    INNERPATH: 'Inner Path',
    SHARENAME: 'Share Name',
    UID: 'UID',
    PRIMARY_IP_ADDRESS: 'Primary IP Address',
    USERNAME: 'Username',
    ROLE: 'Role',
    EXPIRY_DAYS: 'Expiration Days',
    PREFIX: 'Prefix',
    TAGS: 'Tags',
    POSIXUID: 'Posix UID',
    POSIXGID: 'Posix GID',
    S3POLICY: 'S3 Policy',
    SUPPORTEDVERSIONS: 'Supported Versions',
    OWNER: 'Owner',
    CUSTOMERID: 'Customer Name',
    VERSION: 'Version',
  TIERED: 'Tiered',
  HAS_READ_ONLY_BUCKET: 'Has Read Only Bucket',
  HAS_REMOTE_BUCKET: 'Has Remote Bucket'
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

interface SeverityIcons {
  [key: string]: any
}

export const SEVERITIES_ICONS: SeverityIcons = {
  INFO: EventInfo,
  WARNING: Warning,
  DEBUG: DebugWarning,
  MINOR: AccidentMinor,
  MAJOR: AccidentMajor,
  CRITICAL: AccidentCritical
}

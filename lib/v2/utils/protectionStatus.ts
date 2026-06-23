import { PARITY_STATUSES, type ParityStatus, PERCENTAGE } from '#v2/utils/consts'

export const PROTECTION_STATUS_TYPES = {
  FULLY_PROTECTED: 'FULLY_PROTECTED',
  PARTIALLY_PROTECTED: 'PARTIALLY_PROTECTED',
  UNPROTECTED: 'UNPROTECTED',
  REBUILDING: 'REBUILDING',
  REDISTRIBUTING: 'REDISTRIBUTING',
  UNINITIALIZED: 'UNINITIALIZED',
  IO_STOPPED: 'IO_STOPPED',
  PERFORMANCE_DEGRADATION: 'PERFORMANCE_DEGRADATION',
  UNAVAILABLE: 'UNAVAILABLE'
} as const

export type ProtectionStatusType =
  (typeof PROTECTION_STATUS_TYPES)[keyof typeof PROTECTION_STATUS_TYPES]

export const HEALTH_SEVERITIES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
} as const

export type HealthSeverity =
  (typeof HEALTH_SEVERITIES)[keyof typeof HEALTH_SEVERITIES]

export const HEALTH_ICON_TYPES = {
  CHECK: 'check',
  WARNING_TRIANGLE: 'warningTriangle',
  WARNING_CIRCLE: 'warningCircle',
  PAUSE: 'pause'
} as const

export type HealthIconType =
  (typeof HEALTH_ICON_TYPES)[keyof typeof HEALTH_ICON_TYPES]

export const PROTECTION_STATUS_COLORS = {
  GREEN: 'green',
  ORANGE: 'orange',
  RED: 'red',
  GRAY: 'gray'
} as const

export type ProtectionStatusColor =
  (typeof PROTECTION_STATUS_COLORS)[keyof typeof PROTECTION_STATUS_COLORS]

export interface ProtectionStatusInfo {
  key: ProtectionStatusType
  label: string
  color: ProtectionStatusColor
  icon?: HealthIconType
  severity: HealthSeverity
}

export interface ClusterStatusData {
  status?: string
  init_stage?: string
  io_status?: string
  rebuildProgress?: number
}

export const PROTECTION_STATUS_MAP: Record<
  ProtectionStatusType,
  ProtectionStatusInfo
> = {
  FULLY_PROTECTED: {
    key: 'FULLY_PROTECTED',
    label: 'Fully Protected',
    color: 'green',
    icon: 'check',
    severity: 'success'
  },
  REDISTRIBUTING: {
    key: 'REDISTRIBUTING',
    label: 'Redistributing',
    color: 'green',
    icon: 'check',
    severity: 'success'
  },
  PARTIALLY_PROTECTED: {
    key: 'PARTIALLY_PROTECTED',
    label: 'Partially Protected',
    color: 'orange',
    icon: 'warningCircle',
    severity: 'warning'
  },
  REBUILDING: {
    key: 'REBUILDING',
    label: 'Rebuilding',
    color: 'orange',
    icon: 'check',
    severity: 'warning'
  },
  PERFORMANCE_DEGRADATION: {
    key: 'PERFORMANCE_DEGRADATION',
    label: 'Performance Degradation',
    color: 'orange',
    icon: 'warningCircle',
    severity: 'warning'
  },
  UNPROTECTED: {
    key: 'UNPROTECTED',
    label: 'Unprotected',
    color: 'red',
    icon: 'warningTriangle',
    severity: 'error'
  },
  IO_STOPPED: {
    key: 'IO_STOPPED',
    label: 'I/O Stopped',
    color: 'gray',
    icon: 'pause',
    severity: 'info'
  },
  UNINITIALIZED: {
    key: 'UNINITIALIZED',
    label: 'Uninitialized',
    color: 'gray',
    icon: 'pause',
    severity: 'info'
  },
  UNAVAILABLE: {
    key: 'UNAVAILABLE',
    label: 'Unavailable',
    color: 'gray',
    icon: 'pause',
    severity: 'info'
  }
}

const LEGACY_STATUS_LOOKUP: Record<string, ProtectionStatusType> = {
  'FULLY PROTECTED': 'FULLY_PROTECTED',
  OK: 'FULLY_PROTECTED',
  'PARTIALLY PROTECTED': 'PARTIALLY_PROTECTED',
  PARTIALLY_PROTECTED: 'PARTIALLY_PROTECTED',
  UNPROTECTED: 'UNPROTECTED',
  ERROR: 'UNPROTECTED',
  REBUILD: 'REBUILDING',
  REBUILDING: 'REBUILDING',
  REDISTRIBUTING: 'REDISTRIBUTING',
  'I/O STOPPED': 'IO_STOPPED',
  IO_STOPPED: 'IO_STOPPED',
  STOPPED: 'IO_STOPPED',
  UNINITIALIZED: 'UNINITIALIZED',
  UNAVAILABLE: 'UNAVAILABLE'
}

const IO_STATUS_STOPPED = 'STOPPED'
const INIT_STAGE_INITIALIZED = 'INITIALIZED'

/**
 * Resolves the protection status from raw cluster status data
 * (io_status / init_stage / legacy status string).
 */
export function getProtectionStatus(
  data: ClusterStatusData
): ProtectionStatusInfo {
  if (data.io_status === IO_STATUS_STOPPED) {
    return PROTECTION_STATUS_MAP.IO_STOPPED
  }
  if (data.init_stage && data.init_stage !== INIT_STAGE_INITIALIZED) {
    return PROTECTION_STATUS_MAP.UNINITIALIZED
  }
  const status = data.status?.toUpperCase()
  if (status && LEGACY_STATUS_LOOKUP[status]) {
    return PROTECTION_STATUS_MAP[LEGACY_STATUS_LOOKUP[status]]
  }
  return PROTECTION_STATUS_MAP.UNPROTECTED
}

/**
 * Maps a legacy status string (e.g. "OK", "REBUILD") to protection status info.
 */
export function mapLegacyStatus(oldStatus: string): ProtectionStatusInfo {
  const mappedStatus = LEGACY_STATUS_LOOKUP[oldStatus.toUpperCase()]
  return mappedStatus
    ? PROTECTION_STATUS_MAP[mappedStatus]
    : PROTECTION_STATUS_MAP.UNPROTECTED
}

const PROTECTION_TOOLTIP_TEXT: Record<ProtectionStatusType, string> = {
  UNINITIALIZED: 'The system is configured but not started yet',
  FULLY_PROTECTED: 'The system is fully protected and operates normally',
  REBUILDING: 'The system is rebuilding to restore full data protection',
  REDISTRIBUTING: 'The system is redistributing data across the cluster',
  PARTIALLY_PROTECTED:
    'Due to too few remaining active failure domains,\nrebuilding full resilience is not possible',
  PERFORMANCE_DEGRADATION:
    'The system is experiencing reduced performance,\nthroughput and latency may be affected',
  UNPROTECTED:
    'Due to multiple failures, the data is available, but not protected.\nIf one more failure occurs, some of the data might not be available',
  IO_STOPPED: 'I/O operations have been stopped',
  UNAVAILABLE: 'The system is currently unavailable'
}

/** Protection statuses that show a rebuild/redistribute progress bar. */
export const PROGRESS_STATUS_TYPES: ProtectionStatusType[] = [
  PROTECTION_STATUS_TYPES.REBUILDING,
  PROTECTION_STATUS_TYPES.REDISTRIBUTING
]

/** Tooltip copy for a protection status, falling back to its label. */
export function getProtectionTooltip(info: ProtectionStatusInfo): string {
  return PROTECTION_TOOLTIP_TEXT[info.key] ?? info.label
}

const STATUS_COLOR_TO_SEVERITY: Record<ProtectionStatusColor, HealthSeverity> =
  {
    [PROTECTION_STATUS_COLORS.GREEN]: HEALTH_SEVERITIES.SUCCESS,
    [PROTECTION_STATUS_COLORS.ORANGE]: HEALTH_SEVERITIES.WARNING,
    [PROTECTION_STATUS_COLORS.RED]: HEALTH_SEVERITIES.ERROR,
    [PROTECTION_STATUS_COLORS.GRAY]: HEALTH_SEVERITIES.INFO
  }

/** Maps a protection-status color to its severity / style key. */
export function getStatusColorClass(
  color: ProtectionStatusColor
): HealthSeverity {
  return STATUS_COLOR_TO_SEVERITY[color] ?? HEALTH_SEVERITIES.INFO
}

/** The HealthStatus glyph to show for a protection status. */
export function getHealthIconType(info: ProtectionStatusInfo): HealthIconType {
  return info.icon ?? HEALTH_ICON_TYPES.CHECK
}

/** Per-failure-level rebuild progress for a cluster's parity drives. */
export interface ProtectionStateItem {
  numFailures: number
  percent: number
}

/** Builds the rebuild-progress array indexed by failure count. */
export function getRebuildProgress(
  rebuildState: ProtectionStateItem[],
  stripeProtection: number
): number[] {
  const progress = Array.from({ length: stripeProtection }, () => 0)
  rebuildState.forEach(({ numFailures, percent }) => {
    if (numFailures < stripeProtection) {
      progress[numFailures] = percent
    }
  })
  return progress
}

/**
 * Cumulative protection level per box: box N is the data protected against
 * N+ failures (box 0 = protected against any failure).
 */
export function calculateProtectionBoxes(
  rebuildState: ProtectionStateItem[],
  stripeProtection: number
): number[] {
  const progress = getRebuildProgress(rebuildState, stripeProtection)
  const boxes = Array.from({ length: stripeProtection }, () => 0)
  for (let i = 0; i < stripeProtection; i += 1) {
    for (let j = stripeProtection - i - 1; j >= 0; j -= 1) {
      boxes[i] += progress[j]
    }
  }
  return boxes
}

/** The parity-box status for a given fill percentage. */
export function getProtectionBoxStatus(fillPercent: number): ParityStatus {
  if (fillPercent === PERCENTAGE.FULL) {
    return PARITY_STATUSES.HEALTHY
  }
  if (fillPercent > 0) {
    return PARITY_STATUSES.WARNING
  }
  return PARITY_STATUSES.ERROR
}

/** Parity-box statuses for all of a cluster's protection drives. */
export function calculateParityStatuses(
  protectionState: ProtectionStateItem[] | undefined,
  stripeProtectionDrives: number
): ParityStatus[] {
  if (!protectionState || protectionState.length === 0) {
    return Array.from(
      { length: stripeProtectionDrives },
      () => PARITY_STATUSES.HEALTHY
    )
  }
  return calculateProtectionBoxes(protectionState, stripeProtectionDrives).map(
    getProtectionBoxStatus
  )
}

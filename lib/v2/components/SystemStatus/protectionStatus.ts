export const STATUS_COLORS = {
  GREEN: 'green',
  ORANGE: 'orange',
  RED: 'red',
  GRAY: 'gray'
} as const

export type StatusColor = (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS]

export interface ProtectionStatusInfo {
  label: string
  color: StatusColor
}

const STATUS_COLOR_TO_CLASS: Record<StatusColor, string> = {
  [STATUS_COLORS.GREEN]: 'success',
  [STATUS_COLORS.ORANGE]: 'warning',
  [STATUS_COLORS.RED]: 'error',
  [STATUS_COLORS.GRAY]: 'info'
}

const FULLY_PROTECTED: ProtectionStatusInfo = {
  label: 'Fully Protected',
  color: STATUS_COLORS.GREEN
}
const PARTIALLY_PROTECTED: ProtectionStatusInfo = {
  label: 'Partially Protected',
  color: STATUS_COLORS.ORANGE
}
const REBUILDING: ProtectionStatusInfo = {
  label: 'Rebuilding',
  color: STATUS_COLORS.ORANGE
}
const UNPROTECTED: ProtectionStatusInfo = {
  label: 'Unprotected',
  color: STATUS_COLORS.RED
}
const IO_STOPPED: ProtectionStatusInfo = {
  label: 'I/O Stopped',
  color: STATUS_COLORS.GRAY
}

const LEGACY_STATUS_MAP: Record<string, ProtectionStatusInfo> = {
  'FULLY PROTECTED': FULLY_PROTECTED,
  OK: FULLY_PROTECTED,
  REDISTRIBUTING: { label: 'Redistributing', color: STATUS_COLORS.GREEN },
  'PARTIALLY PROTECTED': PARTIALLY_PROTECTED,
  PARTIALLY_PROTECTED: PARTIALLY_PROTECTED,
  REBUILDING: REBUILDING,
  REBUILD: REBUILDING,
  PERFORMANCE_DEGRADATION: {
    label: 'Performance Degradation',
    color: STATUS_COLORS.ORANGE
  },
  UNPROTECTED: UNPROTECTED,
  ERROR: UNPROTECTED,
  UNAVAILABLE: { label: 'Unavailable', color: STATUS_COLORS.GRAY },
  UNINITIALIZED: { label: 'Uninitialized', color: STATUS_COLORS.GRAY },
  'I/O STOPPED': IO_STOPPED,
  IO_STOPPED: IO_STOPPED,
  STOPPED: IO_STOPPED
}

export function mapLegacyStatus(status: string): ProtectionStatusInfo {
  return LEGACY_STATUS_MAP[status.toUpperCase()] ?? UNPROTECTED
}

export function getStatusColorClass(color: StatusColor): string {
  return STATUS_COLOR_TO_CLASS[color] ?? 'info'
}

export const STATUS_VARIANTS = {
  UP: 'up',
  WORKING: 'working',
  DEGRADED: 'degraded',
  DOWN: 'down',
  INFO: 'info',
  /** Brand-purple in-progress state (sync/replication flows). Distinct from the orange WORKING, which reads as a warning next to a DEGRADED chip. */
  SYNCING: 'syncing'
} as const

export type StatusVariant =
  (typeof STATUS_VARIANTS)[keyof typeof STATUS_VARIANTS]

export type StatusCellValue = string | null | undefined

export const UP_STATUSES = new Set(['UP', 'OK', 'READY', 'ACTIVE', 'ENABLED'])
export const WORKING_STATUSES = new Set([
  'CREATING',
  'UPDATING',
  'ADDING',
  'REMOVING',
  'DOWNLOADING',
  'DEACTIVATING',
  'PHASING_IN',
  'PHASING_OUT'
])
export const DEGRADED_STATUSES = new Set(['DEGRADED'])
export const INFO_STATUSES = new Set(['INFO'])
export const SYNCING_STATUSES = new Set(['SYNCING'])

export function getStatusVariant(
  status: StatusCellValue,
  sets?: {
    up?: Set<string>
    working?: Set<string>
    degraded?: Set<string>
    info?: Set<string>
    syncing?: Set<string>
  }
): StatusVariant {
  if (!status) {
    return STATUS_VARIANTS.DOWN
  }

  const normalized = status.toUpperCase()

  if ((sets?.up ?? UP_STATUSES).has(normalized)) {
    return STATUS_VARIANTS.UP
  }
  if ((sets?.working ?? WORKING_STATUSES).has(normalized)) {
    return STATUS_VARIANTS.WORKING
  }
  if ((sets?.degraded ?? DEGRADED_STATUSES).has(normalized)) {
    return STATUS_VARIANTS.DEGRADED
  }
  if ((sets?.info ?? INFO_STATUSES).has(normalized)) {
    return STATUS_VARIANTS.INFO
  }
  if ((sets?.syncing ?? SYNCING_STATUSES).has(normalized)) {
    return STATUS_VARIANTS.SYNCING
  }

  return STATUS_VARIANTS.DOWN
}

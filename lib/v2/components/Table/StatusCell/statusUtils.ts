export const STATUS_VARIANTS = {
  UP: 'up',
  WORKING: 'working',
  DEGRADED: 'degraded',
  DOWN: 'down'
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

export function getStatusVariant(
  status: StatusCellValue,
  sets?: {
    up?: Set<string>
    working?: Set<string>
    degraded?: Set<string>
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

  return STATUS_VARIANTS.DOWN
}

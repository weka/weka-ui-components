import { describe, expect, it } from 'vitest'

import { PARITY_STATUSES } from '#v2/utils/consts'
import {
  calculateParityStatuses,
  getHealthIconType,
  getProtectionBoxStatus,
  getProtectionStatus,
  getProtectionTooltip,
  HEALTH_ICON_TYPES,
  mapLegacyStatus,
  PROTECTION_STATUS_MAP,
  PROTECTION_STATUS_TYPES
} from '#v2/utils/protectionStatus'

describe('getProtectionStatus', () => {
  it('returns IO_STOPPED when io is stopped', () => {
    expect(getProtectionStatus({ io_status: 'STOPPED' }).key).toBe(
      PROTECTION_STATUS_TYPES.IO_STOPPED
    )
  })

  it('returns UNINITIALIZED when init stage is not initialized', () => {
    expect(getProtectionStatus({ init_stage: 'STARTING' }).key).toBe(
      PROTECTION_STATUS_TYPES.UNINITIALIZED
    )
  })

  it('maps a legacy status string from the data', () => {
    expect(getProtectionStatus({ status: 'OK' }).key).toBe(
      PROTECTION_STATUS_TYPES.FULLY_PROTECTED
    )
  })

  it('falls back to UNPROTECTED for unknown status', () => {
    expect(getProtectionStatus({ status: 'something-else' }).key).toBe(
      PROTECTION_STATUS_TYPES.UNPROTECTED
    )
  })
})

describe('mapLegacyStatus', () => {
  it('maps known legacy strings case-insensitively', () => {
    expect(mapLegacyStatus('rebuild').key).toBe(
      PROTECTION_STATUS_TYPES.REBUILDING
    )
  })

  it('falls back to UNPROTECTED for unknown strings', () => {
    expect(mapLegacyStatus('nope').key).toBe(
      PROTECTION_STATUS_TYPES.UNPROTECTED
    )
  })
})

describe('getHealthIconType', () => {
  it('returns the warning triangle for unprotected', () => {
    expect(getHealthIconType(PROTECTION_STATUS_MAP.UNPROTECTED)).toBe(
      HEALTH_ICON_TYPES.WARNING_TRIANGLE
    )
  })

  it('returns the warning circle for partially protected', () => {
    expect(getHealthIconType(PROTECTION_STATUS_MAP.PARTIALLY_PROTECTED)).toBe(
      HEALTH_ICON_TYPES.WARNING_CIRCLE
    )
  })

  it('returns pause for paused statuses', () => {
    expect(getHealthIconType(PROTECTION_STATUS_MAP.IO_STOPPED)).toBe(
      HEALTH_ICON_TYPES.PAUSE
    )
  })

  it('returns check otherwise', () => {
    expect(getHealthIconType(PROTECTION_STATUS_MAP.FULLY_PROTECTED)).toBe(
      HEALTH_ICON_TYPES.CHECK
    )
  })
})

describe('getProtectionTooltip', () => {
  it('returns the status-specific tooltip text', () => {
    expect(getProtectionTooltip(PROTECTION_STATUS_MAP.IO_STOPPED)).toBe(
      'I/O operations have been stopped'
    )
  })
})

const FULL_FILL = 100
const PARTIAL_FILL = 40
const NO_FILL = 0

describe('getProtectionBoxStatus', () => {
  it('is healthy at 100%, warning when partial, error at 0%', () => {
    expect(getProtectionBoxStatus(FULL_FILL)).toBe(PARITY_STATUSES.HEALTHY)
    expect(getProtectionBoxStatus(PARTIAL_FILL)).toBe(PARITY_STATUSES.WARNING)
    expect(getProtectionBoxStatus(NO_FILL)).toBe(PARITY_STATUSES.ERROR)
  })
})

describe('calculateParityStatuses', () => {
  it('returns all-healthy when there is no protection state', () => {
    expect(calculateParityStatuses(undefined, 2)).toEqual([
      PARITY_STATUSES.HEALTHY,
      PARITY_STATUSES.HEALTHY
    ])
  })

  it('derives a status per parity drive from the protection state', () => {
    const result = calculateParityStatuses(
      [{ numFailures: 0, percent: 100 }],
      2
    )
    expect(result).toHaveLength(2)
    expect(result[0]).toBe(PARITY_STATUSES.HEALTHY)
  })
})

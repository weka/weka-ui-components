import { TIMES_SECONDS } from '#consts'

export interface DurationUnitOption {
  label: string
  value: number
}

/** Unit options for a duration; each `value` is the unit length in seconds. */
export const DURATION_UNIT_OPTIONS: DurationUnitOption[] = [
  { label: 'Months', value: TIMES_SECONDS.Months },
  { label: 'Weeks', value: TIMES_SECONDS.Weeks },
  { label: 'Days', value: TIMES_SECONDS.Days },
  { label: 'Hours', value: TIMES_SECONDS.Hours },
  { label: 'Minutes', value: TIMES_SECONDS.Minutes },
  { label: 'Seconds', value: TIMES_SECONDS.Seconds }
]

import type {
  CapacityAmountUnitOption,
  CapacityAmountValue
} from '../components/inputs/CapacityAmountInput'

/**
 * Display names for the unit dropdowns, kept to at most 3 characters so the
 * fixed-width unit segment fits them without resizing per option.
 */
const SHORT_UNIT_LABELS: Record<string, string> = {
  Bytes: 'B',
  Seconds: 'Sec',
  Minutes: 'Min',
  Hours: 'Hr',
  Days: 'D',
  Weeks: 'Wk',
  Months: 'Mo'
}

export const DEFAULT_CAPACITY_UNIT_LABELS = ['GB', 'GiB']

const RATE_SUFFIX = '/s'

/**
 * Rate fields (container bandwidth) label their options `GB/s`; the preferred
 * labels are the plain capacity units, so compare without the suffix or the
 * fallback lands on the largest option.
 */
function baseUnitLabel(label: string): string {
  return label.endsWith(RATE_SUFFIX)
    ? label.slice(0, -RATE_SUFFIX.length)
    : label
}

export function toShortUnitOptions(
  options: readonly CapacityAmountUnitOption[]
): CapacityAmountUnitOption[] {
  return options.map((option) => {
    const base = baseUnitLabel(option.label)
    const shortBase = SHORT_UNIT_LABELS[base] ?? base
    return {
      ...option,
      label: base === option.label ? shortBase : `${shortBase}${RATE_SUFFIX}`
    }
  })
}

export function resolveDefaultUnit(
  options: readonly CapacityAmountUnitOption[],
  preferredLabels: readonly string[]
): CapacityAmountUnitOption | undefined {
  const preferred = options.find((option) =>
    preferredLabels.includes(baseUnitLabel(option.label))
  )
  return preferred ?? options[0]
}

export function resolveAdoptedUnit(
  currentUnit: CapacityAmountValue['unit'] | undefined,
  defaultUnit: CapacityAmountUnitOption | undefined
): CapacityAmountValue['unit'] {
  if (currentUnit?.value !== undefined) {
    return currentUnit
  }
  return defaultUnit
    ? { label: defaultUnit.label, value: defaultUnit.value }
    : { label: undefined, value: undefined }
}

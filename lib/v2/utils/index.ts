export type { GradientColorKey, GradientColors } from '../styles/gradientColors'
export {
  createGradientId,
  getGradientColors,
  GRADIENT_COLORS
} from '../styles/gradientColors'
export type { CapacityUnitType } from '#v2/utils/capacityUtils'
export {
  BYTE_METRIC_BASE,
  BYTE_METRIC_BASE2,
  formatCapacitySmart,
  formatNumericValue,
  getUnitsConfig,
  SIZES_BASE2,
  SIZES_BASE10,
  UNIT_TYPES
} from '#v2/utils/capacityUtils'
export { calculateVisibleChips } from '#v2/utils/chipMeasurement'
export type {
  BaseSeverity,
  CloudIconVariant,
  FilterType,
  ParityStatus,
  Severity,
  SeverityLevel,
  TooltipPlacement
} from '#v2/utils/consts'
export {
  ANY_LABEL,
  CLOUD_ICON_VARIANTS,
  COMMA_SEPARATOR,
  CSS_VARS,
  DOM_EVENTS,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  EMPTY_REF_ARRAY,
  EMPTY_STRING,
  EMPTY_STRING_ARRAY,
  FILTER_TYPES,
  ICON_SIZES,
  KEYBOARD_KEYS,
  NOOP,
  NOT_APPLICABLE,
  PARITY_STATUSES,
  PERCENTAGE,
  SEARCH_PLACEHOLDER,
  SEVERITY_LABELS,
  SEVERITY_ORDER_ASC,
  SEVERITY_ORDER_DESC,
  SEVERITY_TYPES,
  TOOLTIP_PLACEMENTS
} from '#v2/utils/consts'
export type {
  ClusterStatusData,
  HealthIconType,
  HealthSeverity,
  ProtectionStateItem,
  ProtectionStatusColor,
  ProtectionStatusInfo,
  ProtectionStatusType
} from '#v2/utils/protectionStatus'
export {
  calculateParityStatuses,
  calculateProtectionBoxes,
  getHealthIconType,
  getProtectionBoxStatus,
  getProtectionStatus,
  getProtectionTooltip,
  getRebuildProgress,
  getStatusColorClass,
  HEALTH_ICON_TYPES,
  HEALTH_SEVERITIES,
  mapLegacyStatus,
  PROGRESS_STATUS_TYPES,
  PROTECTION_STATUS_COLORS,
  PROTECTION_STATUS_MAP,
  PROTECTION_STATUS_TYPES
} from '#v2/utils/protectionStatus'
export { highlightText } from '#v2/utils/textUtils'
export type { TimestampInput } from '#v2/utils/timeUtils'
export {
  formatDate,
  formatISODate,
  formatTimestamp,
  getDaysOfTheMonth,
  getUserLocale,
  toDateTime
} from '#v2/utils/timeUtils'

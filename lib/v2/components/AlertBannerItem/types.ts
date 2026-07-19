import type { SeverityLevel } from '#v2/utils/consts'

export const ALERT_BANNER_SEVERITY = {
  SUCCESS: 'success'
} as const

export type AlertBannerSeverity =
  | SeverityLevel
  | (typeof ALERT_BANNER_SEVERITY)[keyof typeof ALERT_BANNER_SEVERITY]

export interface AlertBannerItemData {
  id: string
  severity: AlertBannerSeverity
  prefixText?: string
  boldPrefix?: string
  message: string
  linkText?: string
  linkUrl?: string
  onLinkClick?: () => void
  closable?: boolean
}

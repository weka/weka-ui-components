import clsx from 'clsx'

import { InfoIcon, WarningIcon } from '../../icons'

import styles from './sectionMessage.module.scss'

export const SECTION_MESSAGE_VARIANTS = {
  INFO: 'info',
  WARNING: 'warning'
} as const

export type SectionMessageVariant =
  (typeof SECTION_MESSAGE_VARIANTS)[keyof typeof SECTION_MESSAGE_VARIANTS]

const DEFAULT_ICON_SIZE = 24
const COMPACT_ICON_SIZE = 16

export interface SectionMessageProps {
  message: string
  label?: string
  variant?: SectionMessageVariant
  /** Dialog density: smaller icon and text, full width instead of fit-content. */
  compact?: boolean
  extraClass?: string
}

export function SectionMessage({
  message,
  label,
  variant = SECTION_MESSAGE_VARIANTS.INFO,
  compact = false,
  extraClass
}: Readonly<SectionMessageProps>) {
  const isWarning = variant === SECTION_MESSAGE_VARIANTS.WARNING
  const iconSize = compact ? COMPACT_ICON_SIZE : DEFAULT_ICON_SIZE

  return (
    <div
      className={clsx(
        styles.callout,
        compact && styles.compact,
        isWarning && styles.warning,
        extraClass
      )}
    >
      <span className={styles.icon}>
        {isWarning ? (
          <WarningIcon size={iconSize} />
        ) : (
          <InfoIcon
            height={iconSize}
            width={iconSize}
          />
        )}
      </span>
      <div className={styles.body}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  )
}

import clsx from 'clsx'

import styles from './capabilitiesCell.module.scss'

export interface CapabilitiesCellProps {
  thinlyProvisioned?: boolean
  tiered?: boolean
  encrypted?: boolean
}

interface BadgeConfig {
  key: string
  label: string
  className: string
  isActive: (props: CapabilitiesCellProps) => boolean
}

const BADGE_CONFIGS: BadgeConfig[] = [
  {
    key: 'thin',
    label: 'Thin',
    className: styles.badgeThin,
    isActive: (p) => Boolean(p.thinlyProvisioned)
  },
  {
    key: 'tier',
    label: 'Tier',
    className: styles.badgeTier,
    isActive: (p) => Boolean(p.tiered)
  },
  {
    key: 'encrypted',
    label: 'Enc.',
    className: styles.badgeEncrypted,
    isActive: (p) => Boolean(p.encrypted)
  }
]

export function CapabilitiesCell(props: Readonly<CapabilitiesCellProps>) {
  const activeBadges = BADGE_CONFIGS.filter(({ isActive }) => isActive(props))

  if (activeBadges.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {activeBadges.map(({ key, label, className }) => (
        <div
          key={key}
          className={clsx(styles.badge, className)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

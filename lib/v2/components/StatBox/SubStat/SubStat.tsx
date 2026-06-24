import type { StatBoxSubStat } from '../statBoxConstants'

import styles from '../statBox.module.scss'

/**
 * A single label/value(/unit) row inside a StatBox. Its appearance is driven
 * by the parent's `.statContent.<variant>` selectors, so it shares the parent
 * `statBox.module.scss` rather than owning its own stylesheet.
 */
export function SubStat({ label, value, unit }: Readonly<StatBoxSubStat>) {
  return (
    <div className={styles.subStat}>
      <span className={styles.subStatLabel}>{label}</span>
      <span className={styles.subStatValueGroup}>
        <span className={styles.subStatValue}>{value}</span>
        {unit ? <span className={styles.subStatUnit}>{unit}</span> : null}
      </span>
    </div>
  )
}

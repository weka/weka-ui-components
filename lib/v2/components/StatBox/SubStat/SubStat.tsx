import type { StatBoxSubStat } from '../statBoxConstants'

import { Tooltip } from '../../Tooltip'

import styles from '../statBox.module.scss'

/**
 * A single label/value(/unit) row inside a StatBox. Its appearance is driven
 * by the parent's `.statContent.<variant>` selectors, so it shares the parent
 * `statBox.module.scss` rather than owning its own stylesheet. When
 * `labelTooltip` is set the label truncates with an ellipsis and reveals the
 * full text on hover (only while truncated) via the v2 `Tooltip` ellipsis mode.
 */
export function SubStat({
  label,
  value,
  unit,
  labelTooltip
}: Readonly<StatBoxSubStat>) {
  return (
    <div className={styles.subStat}>
      {labelTooltip ? (
        <Tooltip
          data={labelTooltip}
          ellipsis
          ellipsisClass={styles.subStatLabel}
        >
          {label}
        </Tooltip>
      ) : (
        <span className={styles.subStatLabel}>{label}</span>
      )}
      <span className={styles.subStatValueGroup}>
        <span className={styles.subStatValue}>{value}</span>
        {unit ? <span className={styles.subStatUnit}>{unit}</span> : null}
      </span>
    </div>
  )
}

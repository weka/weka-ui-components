import type { StatusVariant } from '../Table/StatusCell'

import clsx from 'clsx'

import { Chip } from '../Chip'
import { STATUS_VARIANTS } from '../Table/StatusCell'

import styles from './statusChip.module.scss'

const DOT_CLASS_BY_VARIANT: Record<StatusVariant, string> = {
  [STATUS_VARIANTS.UP]: styles.dotUp,
  [STATUS_VARIANTS.WORKING]: styles.dotWorking,
  [STATUS_VARIANTS.DEGRADED]: styles.dotDegraded,
  [STATUS_VARIANTS.DOWN]: styles.dotDown,
  [STATUS_VARIANTS.INFO]: styles.dotInfo
}

const CHIP_BACKGROUND_CLASS_BY_VARIANT: Record<StatusVariant, string> = {
  [STATUS_VARIANTS.UP]: styles.chipUp,
  [STATUS_VARIANTS.WORKING]: styles.chipWorking,
  [STATUS_VARIANTS.DEGRADED]: styles.chipDegraded,
  [STATUS_VARIANTS.DOWN]: styles.chipDown,
  [STATUS_VARIANTS.INFO]: styles.chipInfo
}

interface BuildChipClassNameArgs {
  variant: StatusVariant | undefined
  color: string | undefined
  tinted: boolean
  isClickable: boolean
  selected: boolean
  extraClass: string | undefined
}

function buildChipClassName({
  variant,
  color,
  tinted,
  isClickable,
  selected,
  extraClass
}: BuildChipClassNameArgs): string {
  return clsx(
    styles.statusChip,
    tinted && styles.tinted,
    !color && variant && CHIP_BACKGROUND_CLASS_BY_VARIANT[variant],
    isClickable && styles.clickable,
    selected && styles.selected,
    extraClass
  )
}

export interface StatusChipProps {
  label: string
  /** Picks the dot color from the shared status palette; omit together with `color` for a colorless chip (e.g. a peer-name filter chip). */
  variant?: StatusVariant
  /** Overrides the dot color with an arbitrary CSS color, bypassing `variant`. */
  color?: string
  /** Trailing count badge, for filter-bar usage. */
  count?: number
  /** Highlights the chip as the active filter selection. */
  selected?: boolean
  /**
   * Table-cell badge look: a light tint of the variant color behind a
   * same-hue, dark, semibold label and a small rounded-square dot, with a
   * 4px corner radius — matching the design's in-row status pill. Opt in
   * per call site — existing colorless-background consumers (nav/header
   * chips, etc.) are unaffected.
   */
  tinted?: boolean
  onClick?: () => void
  extraClass?: string
}

export function StatusChip({
  label,
  variant,
  color,
  count,
  selected = false,
  tinted = false,
  onClick,
  extraClass
}: Readonly<StatusChipProps>) {
  const showDot = Boolean(variant) || Boolean(color)

  return (
    <Chip
      onClick={onClick}
      extraClass={buildChipClassName({
        variant,
        color,
        tinted,
        selected,
        extraClass,
        isClickable: Boolean(onClick)
      })}
    >
      {showDot ? (
        <span
          style={color ? { backgroundColor: color } : undefined}
          className={clsx(
            styles.dot,
            !color && variant && DOT_CLASS_BY_VARIANT[variant]
          )}
        />
      ) : null}
      <span className={styles.label}>{label}</span>
      {count !== undefined ? (
        <span className={styles.count}>{count}</span>
      ) : null}
    </Chip>
  )
}

import clsx from 'clsx'

import { clampPercentage } from '../capacityFormat'

import styles from '../capacityWidget.module.scss'

export const CAPSULE_TONES = {
  SSD: 'ssd',
  OBS: 'obs'
} as const

export type CapsuleTone = (typeof CAPSULE_TONES)[keyof typeof CAPSULE_TONES]

export interface VerticalCapsuleProps {
  label: string
  /** Fraction of the capsule to fill, as a percentage (`0`–`100`). */
  fillPercentage: number
  tone: CapsuleTone
  wide?: boolean
}

const TONE_FILL_CLASSES: Record<CapsuleTone, string> = {
  [CAPSULE_TONES.SSD]: styles.capsuleFillSsd,
  [CAPSULE_TONES.OBS]: styles.capsuleFillObs
}

const TONE_LABEL_CLASSES: Record<CapsuleTone, string> = {
  [CAPSULE_TONES.SSD]: styles.capsuleLabelSsd,
  [CAPSULE_TONES.OBS]: styles.capsuleLabelObs
}

export function VerticalCapsule({
  label,
  fillPercentage,
  tone,
  wide = false
}: Readonly<VerticalCapsuleProps>) {
  return (
    <div className={styles.capsule}>
      <div className={clsx(styles.capsuleBar, wide && styles.capsuleBarWide)}>
        <div
          className={clsx(styles.capsuleFill, TONE_FILL_CLASSES[tone])}
          style={{ height: `${clampPercentage(fillPercentage)}%` }}
        />
      </div>
      <span className={clsx(styles.capsuleLabel, TONE_LABEL_CLASSES[tone])}>
        {label}
      </span>
    </div>
  )
}

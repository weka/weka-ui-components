import type { CapacityTierData, CapacityWidgetLabels } from './types'

import clsx from 'clsx'

import {
  DEFAULT_CAPACITY_UNIT,
  formatCapacity,
  toPercentage
} from './capacityFormat'
import { LegendItem } from './LegendItem'
import { TotalPill } from './TotalPill'
import { CAPSULE_TONES, type CapsuleTone, VerticalCapsule } from './VerticalCapsule'

import styles from './capacityWidget.module.scss'

export interface ProvisionedSectionProps {
  ssd: CapacityTierData
  obs?: CapacityTierData
  total: number
  totalUnit: string
  totalDisplay?: string
  labels: CapacityWidgetLabels
  noDataReduction?: boolean
}

const TIER_DOT_CLASSES: Record<CapsuleTone, string> = {
  [CAPSULE_TONES.SSD]: styles.dotSsd,
  [CAPSULE_TONES.OBS]: styles.dotObs
}

function tierFillPercentage(tier: CapacityTierData): number {
  return toPercentage(tier.written, tier.provisioned)
}

export function ProvisionedSection({
  ssd,
  obs,
  total,
  totalUnit,
  totalDisplay,
  labels,
  noDataReduction = false
}: Readonly<ProvisionedSectionProps>) {
  const hasObs = Boolean(obs)
  const ssdUnit = ssd.unit ?? DEFAULT_CAPACITY_UNIT
  const totalAmount = formatCapacity(total, totalUnit, totalDisplay)

  const renderTierBlock = (tier: CapacityTierData, tone: CapsuleTone) => {
    const unit = tier.unit ?? DEFAULT_CAPACITY_UNIT
    return (
      <div className={styles.tierBlock}>
        <LegendItem
          amount={formatCapacity(tier.written, unit, tier.writtenDisplay)}
          dotClass={TIER_DOT_CLASSES[tone]}
          label={labels.written}
        />
        <LegendItem
          label={labels.provisioned}
          amount={formatCapacity(
            tier.provisioned,
            unit,
            tier.provisionedDisplay
          )}
        />
      </div>
    )
  }

  return (
    <div className={styles.provisionedSection}>
      <div
        className={clsx(
          styles.provisionedBody,
          !hasObs && styles.provisionedBodyNoObs,
          !hasObs && noDataReduction && styles.provisionedBodyNoObsNoDr
        )}
      >
        <div className={styles.capsules}>
          <VerticalCapsule
            fillPercentage={tierFillPercentage(ssd)}
            label={labels.ssd}
            tone={CAPSULE_TONES.SSD}
            wide={!hasObs}
          />
          {obs ? (
            <VerticalCapsule
              fillPercentage={tierFillPercentage(obs)}
              label={labels.obs}
              tone={CAPSULE_TONES.OBS}
            />
          ) : null}
        </div>
        <div className={styles.provisionedLegend}>
          {hasObs ? (
            <>
              {renderTierBlock(ssd, CAPSULE_TONES.SSD)}
              <div className={styles.tierSeparator} />
              {obs ? renderTierBlock(obs, CAPSULE_TONES.OBS) : null}
            </>
          ) : (
            <div className={styles.tierBlock}>
              <LegendItem
                amount={formatCapacity(ssd.written, ssdUnit, ssd.writtenDisplay)}
                dotClass={styles.dotSsd}
                label={labels.written}
              />
              <LegendItem
                amount={totalAmount}
                className={styles.totalProvisionedItem}
                label={labels.totalProvisioned}
              />
            </div>
          )}
        </div>
      </div>
      {hasObs ? (
        <TotalPill
          amount={totalAmount}
          label={labels.totalProvisioned}
        />
      ) : null}
    </div>
  )
}

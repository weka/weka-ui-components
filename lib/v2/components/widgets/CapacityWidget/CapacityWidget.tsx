import type { CapacityWidgetLabels, CapacityWidgetProps } from './types'

import { DEFAULT_CAPACITY_UNIT } from './capacityFormat'
import { ProvisionedSection } from './ProvisionedSection'
import { UsableSection } from './UsableSection'

import styles from './capacityWidget.module.scss'

export type {
  CapacityDataReduction,
  CapacityProvisionedData,
  CapacityTierData,
  CapacityUsableData,
  CapacityWidgetLabels,
  CapacityWidgetProps
} from './types'

const DEFAULT_LABELS: CapacityWidgetLabels = {
  used: 'Used',
  free: 'Free',
  totalUsable: 'Total Usable',
  dataReduction: 'Data Reduction',
  saving: 'Saving',
  written: 'Written',
  provisioned: 'Provisioned',
  totalProvisioned: 'Total Provisioned',
  ssd: 'SSD',
  obs: 'OBS'
}

/**
 * Consolidated capacity widget combining usable capacity (donut) and
 * provisioned capacity (SSD, plus optional OBS object-store capsule). Fully
 * responsive: it fills its container and adapts its layout across width
 * breakpoints via container queries.
 */
export function CapacityWidget({
  usable,
  provisioned,
  labels: labelsProp
}: Readonly<CapacityWidgetProps>) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }

  return (
    <div className={styles.widget}>
      <UsableSection
        data={usable}
        labels={labels}
      />
      <div className={styles.divider} />
      <ProvisionedSection
        labels={labels}
        noDataReduction={!usable.dataReduction}
        obs={provisioned.obs}
        ssd={provisioned.ssd}
        total={provisioned.total}
        totalDisplay={provisioned.totalDisplay}
        totalUnit={provisioned.unit ?? provisioned.ssd.unit ?? DEFAULT_CAPACITY_UNIT}
      />
    </div>
  )
}

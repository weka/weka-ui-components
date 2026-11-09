export interface CapacityDataReduction {
  ratio: string
  savings: string
}

export interface CapacityUsableData {
  used: number
  /** Read only when `sharedPool` is not set. */
  free?: number
  /** Read only when `sharedPool` is not set. */
  total?: number
  /**
   * No capacity of its own: the used space comes out of a pool shared with
   * others, so there is no donut and no Free, and the footer shows
   * `labels.sharedPool` instead of Total Usable.
   */
  sharedPool?: boolean
  unit?: string
  usedDisplay?: string
  freeDisplay?: string
  totalDisplay?: string
  dataReduction?: CapacityDataReduction
}

export interface CapacityTierData {
  written: number
  provisioned: number
  unit?: string
  writtenDisplay?: string
  provisionedDisplay?: string
}

export interface CapacityProvisionedData {
  ssd: CapacityTierData
  obs?: CapacityTierData
  total: number
  unit?: string
  totalDisplay?: string
  /**
   * The most that may be provisioned. When set, a footer shows it with the
   * share of it already provisioned, as text and as a thin bar.
   */
  quota?: number
  quotaDisplay?: string
}

export interface CapacityWidgetLabels {
  used: string
  free: string
  totalUsable: string
  dataReduction: string
  saving: string
  written: string
  provisioned: string
  totalProvisioned: string
  ssd: string
  obs: string
  sharedPool: string
  quota: string
}

export interface CapacityWidgetProps {
  usable: CapacityUsableData
  provisioned: CapacityProvisionedData
  labels?: Partial<CapacityWidgetLabels>
}

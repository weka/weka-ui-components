export interface CapacityDataReduction {
  ratio: string
  savings: string
}

export interface CapacityUsableData {
  used: number
  free: number
  total: number
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
}

export interface CapacityWidgetProps {
  usable: CapacityUsableData
  provisioned: CapacityProvisionedData
  labels?: Partial<CapacityWidgetLabels>
}

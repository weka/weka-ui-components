import { PARITY_STATUSES } from '#v2/utils/consts'
import {
  calculateParityStatuses,
  getHealthIconType,
  getProtectionTooltip,
  mapLegacyStatus,
  PROGRESS_STATUS_TYPES,
  type ProtectionStateItem
} from '#v2/utils/protectionStatus'

import { BackUpServerIcon, BackUpServersIcon } from '../../../icons'
import { HealthStatus } from '../../HealthStatus'

import styles from './clusterProtection.module.scss'

const SERVERS_ICON_SIZE = 50
const PARITY_ICON_WIDTH = 24
const PARITY_ICON_HEIGHT = 50
const DEFAULT_VIRTUAL_SPARES = '3'

export interface ClusterProtectionLabels {
  dataProtection: string
  data: string
  parity: string
  virtualSpares: string
  upFor: string
}

const DEFAULT_LABELS: ClusterProtectionLabels = {
  dataProtection: 'Data Protection',
  data: 'Data',
  parity: 'Parity',
  virtualSpares: 'Virtual Spares',
  upFor: 'Up For'
}

export interface ClusterProtectionProps {
  systemStatus?: string
  systemRebuildProgress?: number
  virtualSpares?: string
  upFor?: string
  stripeDataDrives?: number
  stripeProtectionDrives?: number
  protectionState?: ProtectionStateItem[]
  labels?: Partial<ClusterProtectionLabels>
}

export function ClusterProtection({
  systemStatus,
  systemRebuildProgress,
  virtualSpares,
  upFor,
  stripeDataDrives = 0,
  stripeProtectionDrives = 0,
  protectionState,
  labels
}: Readonly<ClusterProtectionProps>) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const info = systemStatus ? mapLegacyStatus(systemStatus) : undefined
  const parityStatuses = calculateParityStatuses(
    protectionState,
    stripeProtectionDrives
  )
  const showProgress = info ? PROGRESS_STATUS_TYPES.includes(info.key) : false

  return (
    <div className={styles.container}>
      {info ? (
        <HealthStatus
          dataTestId='protection-status-badge'
          iconType={getHealthIconType(info)}
          label={info.label}
          progress={showProgress ? systemRebuildProgress : undefined}
          severity={info.severity}
          tooltipTitle={getProtectionTooltip(info)}
        />
      ) : null}
      <div className={styles.dataProtectionSection}>
        <div className={styles.dataProtectionHeader}>
          <div className={styles.dataProtectionTitle}>
            {text.dataProtection}
          </div>
        </div>
        <div className={styles.iconsRow}>
          <div className={styles.iconGroup}>
            <BackUpServersIcon
              height={SERVERS_ICON_SIZE}
              status={PARITY_STATUSES.ERROR}
              width={SERVERS_ICON_SIZE}
            />
            <div className={styles.groupSeparator} />
            <span
              className={styles.serverNumber}
              data-testid='protection-data-drives'
            >
              {stripeDataDrives}
            </span>
            <span className={styles.groupLabel}>{text.data}</span>
          </div>
          {stripeProtectionDrives ? (
            <>
              <div className={styles.plusSignContainer}>
                <span className={styles.plusSign}>+</span>
              </div>
              <div className={styles.iconGroup}>
                <div className={styles.parityIconsRow}>
                  {parityStatuses.map((parityStatus, idx) => (
                    <BackUpServerIcon
                      key={`parity-${idx}`}
                      height={PARITY_ICON_HEIGHT}
                      status={parityStatus}
                      width={PARITY_ICON_WIDTH}
                    />
                  ))}
                </div>
                <div className={styles.groupSeparator} />
                <span
                  className={styles.serverNumber}
                  data-testid='protection-parity-drives'
                >
                  {stripeProtectionDrives}
                </span>
                <span className={styles.groupLabel}>{text.parity}</span>
              </div>
            </>
          ) : null}
        </div>
        <div
          className={styles.virtualSpares}
          data-testid='protection-virtual-spares'
        >
          {text.virtualSpares}: {virtualSpares ?? DEFAULT_VIRTUAL_SPARES}
        </div>
        <div className={styles.uptimeSection}>
          <div className={styles.uptimeItem}>
            <span className={styles.uptimeLabel}>{text.upFor}:</span>
            <span
              className={styles.uptimeValue}
              data-testid='protection-up-for-time'
            >
              {upFor}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { type ComponentType } from 'react'
import clsx from 'clsx'

import {
  AWSClusterIcon,
  AzureClusterIcon,
  GoogleClusterIcon,
  K8SClusterIcon,
  OCIClusterIcon,
  OnPremIcon,
  WekaClusterIcon
} from '../../icons'
import type { CloudIconVariant } from '../../utils/consts'
import {
  CLOUD_ICON_VARIANTS,
  EMPTY_STRING,
  TOOLTIP_PLACEMENTS
} from '../../utils/consts'
import { Tooltip } from '../Tooltip'

import styles from './clusterIcon.module.scss'

interface ClusterIconComponentProps {
  extraClass?: string
  size?: number
  variant?: CloudIconVariant
}

export const CLUSTER_ICON_VARIANTS = {
  DEFAULT: 'default',
  HEADER_STYLE: 'headerStyle'
} as const

export type ClusterIconVariant =
  (typeof CLUSTER_ICON_VARIANTS)[keyof typeof CLUSTER_ICON_VARIANTS]

export const CLUSTER_ICON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const

export type ClusterIconSize =
  (typeof CLUSTER_ICON_SIZES)[keyof typeof CLUSTER_ICON_SIZES]

export interface ClusterIconProps {
  clusterType: string
  showLabel?: boolean
  variant?: ClusterIconVariant
  size?: ClusterIconSize
  extraClass?: string
}

interface IconConfig {
  IconComponent: ComponentType<ClusterIconComponentProps>
  label: string
}

const ICON_SIZE = 22

const CLUSTER_TYPE_CONFIG: Record<string, IconConfig> = {
  aws: { IconComponent: AWSClusterIcon, label: 'AWS' },
  gcp: { IconComponent: GoogleClusterIcon, label: 'GCP' },
  google: { IconComponent: GoogleClusterIcon, label: 'GCP' },
  azure: { IconComponent: AzureClusterIcon, label: 'Azure' },
  k8s: { IconComponent: K8SClusterIcon, label: 'K8S' },
  oci: { IconComponent: OCIClusterIcon, label: 'OCI' },
  onprem: { IconComponent: OnPremIcon, label: 'On-Prem' },
  'on-prem': { IconComponent: OnPremIcon, label: 'On-Prem' },
  weka: { IconComponent: WekaClusterIcon, label: 'Weka' }
}

const DEFAULT_CONFIG: IconConfig = {
  IconComponent: WekaClusterIcon,
  label: 'Weka'
}

function getIconConfig(clusterType: string): IconConfig {
  return CLUSTER_TYPE_CONFIG[clusterType.toLowerCase()] ?? DEFAULT_CONFIG
}

export function ClusterIcon({
  clusterType,
  showLabel = false,
  variant = CLUSTER_ICON_VARIANTS.DEFAULT,
  size = CLUSTER_ICON_SIZES.MEDIUM,
  extraClass = EMPTY_STRING
}: Readonly<ClusterIconProps>) {
  const config = getIconConfig(clusterType)
  const isHeaderStyle = variant === CLUSTER_ICON_VARIANTS.HEADER_STYLE

  const iconClassName = clsx(
    styles.icon,
    isHeaderStyle ? styles.headerIcon : styles[size],
    extraClass
  )
  const iconVariant = isHeaderStyle
    ? CLOUD_ICON_VARIANTS.HEADER
    : CLOUD_ICON_VARIANTS.DEFAULT
  const wrapperClass = clsx(styles.wrapper, isHeaderStyle && styles.headerStyle)

  const iconElement = (
    <config.IconComponent
      extraClass={iconClassName}
      size={ICON_SIZE}
      variant={iconVariant}
    />
  )

  return (
    <div className={wrapperClass}>
      {showLabel ? (
        <>
          {iconElement}
          <span className={styles.label}>{config.label}</span>
        </>
      ) : (
        <Tooltip
          data={config.label}
          extraClass={styles.iconTooltip}
          placement={TOOLTIP_PLACEMENTS.TOP}
        >
          {iconElement}
        </Tooltip>
      )}
    </div>
  )
}

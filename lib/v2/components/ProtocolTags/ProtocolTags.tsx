import clsx from 'clsx'

import styles from './protocolTags.module.scss'

export const PROTOCOL_TAG_SIZES = {
  SMALL: 'small',
  LARGE: 'large'
} as const

export type ProtocolTagSize =
  (typeof PROTOCOL_TAG_SIZES)[keyof typeof PROTOCOL_TAG_SIZES]

export interface ProtocolsEnabled {
  smb?: boolean
  nfs?: boolean
  tier?: boolean
  s3?: boolean
}

export interface ProtocolTagsProps {
  protocolsEnabled: ProtocolsEnabled
  extraClass?: string
  size?: ProtocolTagSize
}

export function ProtocolTags({
  protocolsEnabled,
  extraClass,
  size = PROTOCOL_TAG_SIZES.LARGE
}: Readonly<ProtocolTagsProps>) {
  const sizeClass =
    size === PROTOCOL_TAG_SIZES.SMALL ? styles.protocolSmall : styles.protocolLarge

  return (
    <div className={clsx(styles.protocols, extraClass)}>
      {protocolsEnabled.smb ? (
        <span className={clsx(styles.protocol, styles.protocolSmb, sizeClass)}>
          SMB
        </span>
      ) : null}
      {protocolsEnabled.nfs ? (
        <span className={clsx(styles.protocol, styles.protocolNfs, sizeClass)}>
          NFS
        </span>
      ) : null}
      {protocolsEnabled.s3 ? (
        <span className={clsx(styles.protocol, styles.protocolS3, sizeClass)}>
          S3
        </span>
      ) : null}
      {protocolsEnabled.tier ? (
        <span className={clsx(styles.protocol, styles.protocolTier, sizeClass)}>
          Tier
        </span>
      ) : null}
    </div>
  )
}

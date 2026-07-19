import type { ReactElement, ReactNode } from 'react'

import { clsx } from 'clsx'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import {
  CloseRoundedIcon,
  VcheckFillIcon,
  WarningCircleIcon,
  WarningTriangleIcon
} from '../../icons'
import { BannerMessageWithTooltip } from './BannerMessageWithTooltip'
import {
  ALERT_BANNER_SEVERITY,
  type AlertBannerItemData,
  type AlertBannerSeverity
} from './types'

import styles from './alertBannerItem.module.scss'

const BANNER_ICON_SIZE = 18

const BANNER_SEVERITY_ICONS: Partial<
  Record<AlertBannerSeverity, ReactElement>
> = {
  [SEVERITY_TYPES.CRITICAL]: (
    <WarningTriangleIcon
      color='currentColor'
      filled
      size={BANNER_ICON_SIZE}
    />
  ),
  [SEVERITY_TYPES.MAJOR]: (
    <WarningCircleIcon
      color='currentColor'
      filled
      size={BANNER_ICON_SIZE}
    />
  ),
  [SEVERITY_TYPES.MINOR]: (
    <WarningTriangleIcon
      color='currentColor'
      filled
      size={BANNER_ICON_SIZE}
    />
  ),
  [SEVERITY_TYPES.WARNING]: (
    <WarningTriangleIcon
      color='currentColor'
      filled
      size={BANNER_ICON_SIZE}
    />
  ),
  [SEVERITY_TYPES.INFO]: (
    <WarningTriangleIcon
      color='currentColor'
      filled
      size={BANNER_ICON_SIZE}
    />
  ),
  [ALERT_BANNER_SEVERITY.SUCCESS]: (
    <VcheckFillIcon
      fill='currentColor'
      height={BANNER_ICON_SIZE}
      width={BANNER_ICON_SIZE}
    />
  )
}

interface BannerLinkOptions {
  linkText?: string
  linkUrl?: string
  onLinkClick?: () => void
}

function renderBannerLink({
  linkText,
  linkUrl,
  onLinkClick
}: BannerLinkOptions): ReactNode {
  if (!linkText) {
    return null
  }
  if (onLinkClick) {
    return (
      <button
        className={styles.linkButton}
        onClick={onLinkClick}
        type='button'
      >
        {linkText}
      </button>
    )
  }
  if (linkUrl) {
    return (
      <a
        className={styles.link}
        href={linkUrl}
        rel='noreferrer'
        target='_blank'
      >
        {linkText}
      </a>
    )
  }
  return null
}

export interface AlertBannerItemProps {
  item: AlertBannerItemData
  onDismiss?: (id: string) => void
  extraClass?: string
}

export function AlertBannerItem({
  item,
  onDismiss,
  extraClass
}: Readonly<AlertBannerItemProps>) {
  const {
    id,
    severity,
    prefixText,
    boldPrefix,
    message,
    linkText,
    linkUrl,
    onLinkClick,
    closable
  } = item

  const handleDismiss = () => {
    onDismiss?.(id)
  }

  const fullText = [prefixText, boldPrefix, message].filter(Boolean).join(' ')
  const isWarning = severity === SEVERITY_TYPES.WARNING
  const isCloseOnLightBackground =
    severity === SEVERITY_TYPES.WARNING ||
    severity === SEVERITY_TYPES.INFO ||
    severity === SEVERITY_TYPES.MINOR

  return (
    <div
      aria-live='polite'
      data-testid='alert-banner-item'
      role='alert'
      className={clsx(
        styles.banner,
        styles[severity],
        { [styles.bannerWithoutClose]: !closable },
        extraClass
      )}
    >
      <div className={styles.iconArea}>{BANNER_SEVERITY_ICONS[severity]}</div>
      <div className={styles.messageArea}>
        <BannerMessageWithTooltip fullText={fullText}>
          {prefixText ? <>{prefixText} </> : null}
          {boldPrefix ? (
            <span className={styles.bold}>{boldPrefix}</span>
          ) : null}
          {boldPrefix ? ' ' : null}
          {message}
        </BannerMessageWithTooltip>
      </div>
      {renderBannerLink({ linkText, linkUrl, onLinkClick })}
      {closable ? (
        <button
          aria-label='Dismiss alert'
          data-testid='alert-banner-close'
          onClick={handleDismiss}
          type='button'
          className={clsx(styles.closeButton, {
            [styles.closeButtonOnWarning]: isWarning,
            [styles.closeButtonOnLight]: isCloseOnLightBackground
          })}
        >
          <CloseRoundedIcon />
        </button>
      ) : null}
    </div>
  )
}

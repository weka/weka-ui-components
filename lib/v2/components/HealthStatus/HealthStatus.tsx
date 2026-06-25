import clsx from 'clsx'

import { EMPTY_STRING, TOOLTIP_PLACEMENTS } from '#v2/utils/consts'
import {
  HEALTH_ICON_TYPES,
  type HealthIconType,
  type HealthSeverity
} from '#v2/utils/protectionStatus'

import {
  PauseIcon,
  VcheckFillIcon,
  WarningCircleIcon,
  WarningTriangleIcon
} from '../../icons'
import { Tooltip } from '../Tooltip'

import styles from './healthStatus.module.scss'

const ICON_SIZE = 40
const ICON_FILL = 'currentColor'
const TOOLTIP_ENTER_DELAY = 200
const PROGRESS_MIN = 0
const PROGRESS_MAX = 100
const PROGRESS_DECIMALS = 1

export interface HealthStatusProps {
  label: string
  severity: HealthSeverity
  iconType: HealthIconType
  tooltipTitle?: string
  progress?: number
  extraClass?: string
  dataTestId?: string
}

function renderHealthIcon(iconType: HealthIconType) {
  if (iconType === HEALTH_ICON_TYPES.PAUSE) {
    return (
      <PauseIcon
        extraClass={styles.icon}
        fill={ICON_FILL}
        height={ICON_SIZE}
        width={ICON_SIZE}
      />
    )
  }
  if (iconType === HEALTH_ICON_TYPES.WARNING_TRIANGLE) {
    return (
      <WarningTriangleIcon
        color={ICON_FILL}
        extraClass={styles.icon}
        filled
        size={ICON_SIZE}
      />
    )
  }
  if (iconType === HEALTH_ICON_TYPES.WARNING_CIRCLE) {
    return (
      <WarningCircleIcon
        color={ICON_FILL}
        extraClass={styles.icon}
        filled
        size={ICON_SIZE}
      />
    )
  }
  return (
    <VcheckFillIcon
      extraClass={styles.icon}
      fill={ICON_FILL}
      height={ICON_SIZE}
      width={ICON_SIZE}
    />
  )
}

export function HealthStatus({
  label,
  severity,
  iconType,
  tooltipTitle,
  progress,
  extraClass,
  dataTestId
}: Readonly<HealthStatusProps>) {
  const hasProgress = typeof progress === 'number' && progress >= PROGRESS_MIN
  const formattedProgress = hasProgress
    ? `${progress.toFixed(PROGRESS_DECIMALS)}%`
    : EMPTY_STRING

  return (
    <Tooltip
      enterDelay={TOOLTIP_ENTER_DELAY}
      placement={TOOLTIP_PLACEMENTS.TOP}
      data={
        <div className={styles.tooltipContent}>
          <div className={styles.statusText}>{tooltipTitle ?? label}</div>
        </div>
      }
    >
      <div
        className={clsx(styles.healthStatus, styles[severity], extraClass)}
        data-testid={dataTestId}
      >
        {renderHealthIcon(iconType)}
        <div className={styles.content}>
          <span className={styles.text}>{label}</span>
          {hasProgress ? (
            <div className={styles.progressWrapper}>
              <div className={styles.progressContainer}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${Math.min(
                      PROGRESS_MAX,
                      Math.max(PROGRESS_MIN, progress)
                    )}%`
                  }}
                />
              </div>
              <span className={styles.percentage}>{formattedProgress}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Tooltip>
  )
}

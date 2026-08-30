import type { ReactNode } from 'react'

import { Children } from 'react'
import clsx from 'clsx'

import { InfoIcon } from '../../icons'
import { Switch } from '../Switch'
import { Tooltip } from '../Tooltip'

import styles from './toggleSection.module.scss'

const TOOLTIP_ENTER_DELAY = 200

export interface ToggleSectionProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  labelTooltip?: string
  switchTooltip?: string
  children?: ReactNode
  contentClass?: string
  showDivider?: boolean
  dataTestId?: string
}

/**
 * A toggle row with a label and optional expandable content shown while the
 * toggle is on. Controlled and presentational: the caller owns `checked`
 * and any form state inside `children`. `labelTooltip` renders an info icon
 * next to the label; `switchTooltip` renders the Switch's own info tooltip
 * (typically a why-disabled explanation).
 */
export function ToggleSection({
  label,
  checked,
  onChange,
  disabled = false,
  labelTooltip,
  switchTooltip,
  children,
  contentClass,
  showDivider = true,
  dataTestId
}: Readonly<ToggleSectionProps>) {
  const hasContent = Children.toArray(children).length > 0

  return (
    <div
      className={clsx(styles.toggleSection, showDivider && styles.divider)}
      data-testid={dataTestId}
    >
      <div className={styles.header}>
        <Switch
          checked={checked}
          dataTestId={dataTestId ? `${dataTestId}-switch` : undefined}
          disabled={disabled}
          onChange={(_event, isChecked) => onChange(isChecked)}
          tooltip={switchTooltip}
        />
        <span className={clsx(styles.label, disabled && styles.labelDisabled)}>
          {label}
        </span>
        {labelTooltip ? (
          <Tooltip
            data={labelTooltip}
            enterDelay={TOOLTIP_ENTER_DELAY}
          >
            <span className={styles.infoIconWrapper}>
              <InfoIcon extraClass={styles.infoIcon} />
            </span>
          </Tooltip>
        ) : null}
      </div>
      {hasContent ? (
        <div
          className={clsx(
            styles.contentGrid,
            checked && styles.contentExpanded
          )}
        >
          <div className={styles.contentClip}>
            {checked ? (
              <div
                className={clsx(styles.content, contentClass)}
                data-testid={dataTestId ? `${dataTestId}-content` : undefined}
              >
                {children}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

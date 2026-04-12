import type { ChangeEvent } from 'react'
import MuiSwitch from '@mui/material/Switch'

import { InfoIcon } from '../../icons'
import { Tooltip } from '../Tooltip'

import styles from './switch.module.scss'

const TOOLTIP_ENTER_DELAY = 200

export interface SwitchProps {
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void
  disabled?: boolean
  dataTestId?: string
  tooltip?: string
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  dataTestId,
  tooltip
}: Readonly<SwitchProps>) {
  return (
    <div className={styles.switchContainer}>
      <MuiSwitch
        checked={checked}
        className={styles.switch}
        data-testid={dataTestId}
        disabled={disabled}
        onChange={onChange}
      />
      {tooltip ? (
        <Tooltip
          data={tooltip}
          enterDelay={TOOLTIP_ENTER_DELAY}
        >
          <div className={styles.infoIconWrapper}>
            <InfoIcon extraClass={styles.infoIcon} />
          </div>
        </Tooltip>
      ) : null}
    </div>
  )
}

import type { ChangeEvent } from 'react'

import MuiSwitch from '@mui/material/Switch'

import { InfoIcon } from '../../icons'
import { Tooltip } from '../Tooltip'

import styles from './switch.module.scss'

const TOOLTIP_ENTER_DELAY = 200

export interface SwitchProps {
  /** Id of the underlying checkbox input, so an external `<label htmlFor>` can name it. */
  id?: string
  /** Accessible name of the checkbox when there is no visible label to bind. */
  ariaLabel?: string
  /** Id of a visible label element that names the checkbox. */
  ariaLabelledBy?: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void
  disabled?: boolean
  dataTestId?: string
  tooltip?: string
}

export function Switch({
  id,
  ariaLabel,
  ariaLabelledBy,
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
        id={id}
        onChange={onChange}
        /* eslint-disable-next-line sonarjs/deprecation -- `slotProps.input` only exists in MUI 6; `inputProps` reaches the checkbox on both supported majors. */
        inputProps={{
          'aria-label': ariaLabel,
          'aria-labelledby': ariaLabelledBy
        }}
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

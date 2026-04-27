import { ARROW_DIRECTIONS, ArrowIcon } from '../../icons'

import styles from './numInputSpinButton.module.scss'

export interface NumInputSpinButtonProps {
  onClickUp: () => void
  onClickDown: () => void
  disabled?: boolean
}

export function NumInputSpinButton({
  onClickUp,
  onClickDown,
  disabled = false
}: Readonly<NumInputSpinButtonProps>) {
  return (
    <div className={styles.numSpinBtn}>
      <button
        className={styles.numSpinUp}
        disabled={disabled}
        onClick={onClickUp}
        type='button'
      >
        <ArrowIcon
          direction={ARROW_DIRECTIONS.DESC}
          extraClass={styles.numSpinIcon}
        />
      </button>
      <button
        className={styles.numSpinDown}
        disabled={disabled}
        onClick={onClickDown}
        type='button'
      >
        <ArrowIcon
          direction={ARROW_DIRECTIONS.ASC}
          extraClass={styles.numSpinIcon}
        />
      </button>
    </div>
  )
}

import { SEVERITY_ICONS } from '../../icons'
import { type Severity, SEVERITY_TYPES } from '../../utils/consts'
import { Chip } from '../Chip'

import styles from './severityChip.module.scss'

const CLOSE_FILL_DARK = 'rgba(0, 0, 0, 0.5)'
const CLOSE_FILL_LIGHT = 'rgba(255, 255, 255, 0.5)'

export interface SeverityChipProps {
  severity: Severity
  closable?: boolean
  onClose?: () => void
}

export function SeverityChip({
  severity,
  closable = false,
  onClose
}: Readonly<SeverityChipProps>) {
  const displaySeverity = (severity?.toLowerCase() ||
    SEVERITY_TYPES.INFO) as Severity
  const severityIcon = SEVERITY_ICONS[displaySeverity]

  const closeIconFill =
    displaySeverity === SEVERITY_TYPES.WARNING
      ? CLOSE_FILL_DARK
      : CLOSE_FILL_LIGHT

  return (
    <Chip
      closable={closable}
      closeIconFill={closeIconFill}
      extraClass={styles[displaySeverity]}
      onClose={onClose}
    >
      {severityIcon}
      <span className='capitalizedText'>{displaySeverity}</span>
    </Chip>
  )
}

import type { ReactElement } from 'react'

import type { Severity } from '../utils/consts'
import { SEVERITY_TYPES } from '../utils/consts'

import { BugIcon } from './BugIcon'
import { WarningCircleIcon } from './WarningCircleIcon'
import { WarningIcon } from './WarningIcon'
import { WarningTriangleIcon } from './WarningTriangleIcon'

export const SEVERITY_ICONS: Record<Severity, ReactElement> = {
  [SEVERITY_TYPES.CRITICAL]: <WarningTriangleIcon />,
  [SEVERITY_TYPES.MAJOR]: <WarningCircleIcon />,
  [SEVERITY_TYPES.MINOR]: <WarningTriangleIcon />,
  [SEVERITY_TYPES.WARNING]: <WarningIcon />,
  [SEVERITY_TYPES.INFO]: <WarningCircleIcon />,
  [SEVERITY_TYPES.DEFAULT]: <WarningCircleIcon />,
  [SEVERITY_TYPES.DEBUG]: <BugIcon />
}

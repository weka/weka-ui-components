import type { Severity } from '#v2/utils/consts'
import type { ReactElement } from 'react'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import { BugIcon } from './BugIcon'
import { WarningCircleIcon } from './WarningCircleIcon'
import { WarningIcon } from './WarningIcon'
import { WarningTriangleIcon } from './WarningTriangleIcon'

export const SEVERITY_ICONS: Record<Severity, ReactElement> = {
  [SEVERITY_TYPES.CRITICAL]: <WarningTriangleIcon filled />,
  [SEVERITY_TYPES.MAJOR]: <WarningCircleIcon filled />,
  [SEVERITY_TYPES.MINOR]: <WarningTriangleIcon filled />,
  [SEVERITY_TYPES.WARNING]: <WarningIcon filled />,
  [SEVERITY_TYPES.INFO]: <WarningCircleIcon filled />,
  [SEVERITY_TYPES.DEFAULT]: <WarningCircleIcon filled />,
  [SEVERITY_TYPES.DEBUG]: <BugIcon />
}

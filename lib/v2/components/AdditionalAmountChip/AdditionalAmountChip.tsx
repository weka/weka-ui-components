import { clsx } from 'clsx'

import { Tooltip } from '../Tooltip'

import styles from './additionalAmountChip.module.scss'

export interface AdditionalAmountChipProps {
  count: number
  tooltipContent: string
  extraClass?: string
}

export function AdditionalAmountChip({
  count,
  tooltipContent,
  extraClass
}: Readonly<AdditionalAmountChipProps>) {
  return (
    <Tooltip data={tooltipContent}>
      <div className={clsx(styles.chip, extraClass)}>+{count}</div>
    </Tooltip>
  )
}

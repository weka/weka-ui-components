import { ChartIcon } from '../../icons'
import { CSS_VARS } from '../../utils/consts'

import styles from './emptyChartState.module.scss'

export interface EmptyChartStateProps {
  message?: string
  height?: number | string
}

export function EmptyChartState({
  message = 'No Current Data',
  height = 270
}: Readonly<EmptyChartStateProps>) {
  return (
    <div
      className={styles.emptyState}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className={styles.content}>
        <ChartIcon
          color={CSS_VARS.GRAY_900_100}
          extraClass={styles.icon}
        />
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  )
}

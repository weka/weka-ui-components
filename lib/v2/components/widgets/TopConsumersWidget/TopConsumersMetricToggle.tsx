import clsx from 'clsx'

import {
  TOP_CONSUMERS_METRIC_NAMES,
  type TopConsumersMetric
} from './topConsumersConsts'

import styles from './topConsumersWidget.module.scss'

const TOGGLE_LABEL = 'Metric'

interface TopConsumersMetricToggleProps {
  value: TopConsumersMetric
  options: TopConsumersMetric[]
  onChange: (metric: TopConsumersMetric) => void
  dataTestId?: string
}

/**
 * The design system's small picker-slider (20px, 2px 4px padding), the same
 * control the tenant Overview widgets use for their metric switch.
 */
export function TopConsumersMetricToggle({
  value,
  options,
  onChange,
  dataTestId
}: Readonly<TopConsumersMetricToggleProps>) {
  return (
    <div
      aria-label={TOGGLE_LABEL}
      className={styles.picker}
      data-testid={dataTestId}
      role='group'
    >
      {options.map((metric) => (
        <button
          key={metric}
          aria-pressed={metric === value}
          data-testid={dataTestId ? `${dataTestId}-${metric}` : undefined}
          onClick={() => onChange(metric)}
          type='button'
          className={clsx(
            styles.pickerOption,
            metric === value && styles.pickerActive
          )}
        >
          {TOP_CONSUMERS_METRIC_NAMES[metric]}
        </button>
      ))}
    </div>
  )
}

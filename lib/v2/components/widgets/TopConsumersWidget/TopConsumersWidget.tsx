import type { TopConsumersWidgetProps } from './types'

import { TopConsumersColumnCard } from './TopConsumersColumnCard'
import {
  TOP_CONSUMERS_DEFAULT_GRADIENTS,
  TOP_CONSUMERS_METRIC_ORDER
} from './topConsumersConsts'
import { TopConsumersMetricToggle } from './TopConsumersMetricToggle'

import styles from './topConsumersWidget.module.scss'

const DEFAULT_TITLE = 'Top Consumers'
const DEFAULT_MAX_ITEMS = 5

const testId = (
  dataTestId: string | undefined,
  suffix: string
): string | undefined => (dataTestId ? `${dataTestId}-${suffix}` : undefined)

/**
 * A one-row "Top Consumers" block: a title with the metric picker (throughput /
 * IOPS / latency, active option in the metric's accent) and one ranked card per entity kind — e.g. filesystems,
 * clients, S3 buckets — each a top-N list with horizontal gradient bars.
 * Prop-only and controlled: the caller owns the selected metric and supplies
 * every column's rows, formatter and state for that metric; the widget owns
 * layout, per-card states and the footer. Cards stack below a tablet width.
 */
export function TopConsumersWidget({
  metric,
  onMetricChange,
  columns,
  title = DEFAULT_TITLE,
  metrics = TOP_CONSUMERS_METRIC_ORDER,
  maxItems = DEFAULT_MAX_ITEMS,
  dataTestId
}: Readonly<TopConsumersWidgetProps>) {
  return (
    <section
      aria-label={title}
      className={styles.widget}
      data-testid={dataTestId}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <TopConsumersMetricToggle
          dataTestId={testId(dataTestId, 'metric')}
          onChange={onMetricChange}
          options={metrics}
          value={metric}
        />
      </header>
      <div className={styles.cards}>
        {columns.map((column, index) => (
          <TopConsumersColumnCard
            key={column.key}
            column={column}
            dataTestId={testId(dataTestId, column.key)}
            maxItems={maxItems}
            gradient={
              column.gradient ??
              TOP_CONSUMERS_DEFAULT_GRADIENTS[
                index % TOP_CONSUMERS_DEFAULT_GRADIENTS.length
              ]
            }
          />
        ))}
      </div>
    </section>
  )
}
